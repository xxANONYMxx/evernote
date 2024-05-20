<?php

namespace App\Http\Controllers;

use App\Models\Evernotelist;
use App\Models\Note;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function Laravel\Prompts\error;

class EvernotelistController extends Controller
{
    public function index()
    {
        $curUser = auth()->user();
        if($curUser != null){
            $lists = Evernotelist::with(['creator', 'notes', 'users'])
                ->where('is_public', 1)
                ->orwhere('created_by', $curUser->id)
                ->orWhereHas('users', function ($query) use ($curUser) {
                    $query->where('id', $curUser->id)
                    ->where('is_accepted', true);
            })->get();
            return response()->json($lists, 200);
        }

        $lists = Evernotelist::with(['creator', 'notes', 'users'])->where('is_public', 1)->get();
        return response()->json($lists, 200);
    }

    public function sharedPending()
    {
        $curUser = auth()->user();;

        $lists = Evernotelist::with(['creator', 'notes', 'users'])->get();
        $lists1= [];

        foreach ($lists as $list){
            foreach ($list->users as $user){
                if($user->id == $curUser->id && $user->pivot->is_accepted == false)
                    array_push($lists1, $list);
            }
        }

        return response()->json($lists1, 200);
    }

    public function getInviteableUsers($id)
    {
        $curUser = auth()->user();
        $list = Evernotelist::with('users')->where('created_by', $curUser->id)->find($id);  // Load the list with its users
        if($list){
            // Get IDs of users who are already part of the list or the creator of the list
            $excludedUserIds = $list->users->pluck('id')->toArray();
            $excludedUserIds[] = $list->created_by;  // Add the creator's ID to the excluded list

            $inviteableUsers = User::whereNotIn('id', $excludedUserIds)->get();
            // Fetch users who are neither the creator nor already part of the list
            return response()->json($inviteableUsers);
        }

        if($id == -1){
            $users = User::whereNotIn('id', [$curUser->id])->get();
            return response()->json($users);
        }

       return response()->json('no list found', status: 404);
    }

    public function acceptInv($id)
    {
        $curUser = auth()->user();

        // Zuerst das EvernoteList-Objekt mit den zugehörigen Benutzern laden
        $list = Evernotelist::with(['creator', 'notes', 'users'])
            ->where('id', $id)->first();

        if (!$list) {
            return response()->json("List not found", 404);
        }

        // Überprüfen, ob der Benutzer zu den eingeladenen Nutzern der Liste gehört
        $user = $list->users->firstWhere('id', $curUser->id);
        if ($user && $user->pivot->is_accepted == false) {
            // Aktualisiere den is_accepted Wert in der Pivot-Tabelle
            $user->pivot->is_accepted = true;
            $user->pivot->save();

            return response()->json($list, 200);
        }

        return response()->json("No pending invitation found or already accepted", 409);
    }

    public function store(Request $request)
    {
        $curUser = auth()->user();
        $request->merge(['created_by' => $curUser->id]);

        DB::beginTransaction();

        try{
            $list = Evernotelist::create($request->all());

            if(isset($request['notes'])){
                throw new Exception("No Notes allowed on List creation!");
            }

            $ids = [];
            if(isset($request['users']) && is_array($request['users'])) {
                foreach ($request['users'] as $user) {
                    array_push($ids, $user['id']);
                }
            }

            $list->users()->sync($ids);
            $list->save();

            DB::commit();
            return response()->json($list, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving List failed: " . $e->getMessage(), 409);
        }
    }

    public function show($id)
    {
        $curUser = auth()->user();
        if($curUser != null) {
            $list = Evernotelist::where('id', $id)
                ->where(function ($query) use ($curUser) {
                    $query->where('is_public', 1)
                        ->orwhere('created_by', $curUser->id,)
                        ->orWhereHas('users', function ($query) use ($curUser) {
                            $query->where('id', $curUser->id)
                                ->where('is_accepted', true);
                        })->get();
                })
                ->with(['creator', 'notes', 'users'])->first();
            return $list != null ? response()->json($list, 200) : response()->json(null, 200);
        }

        $list = Evernotelist::with(['creator', 'notes', 'users'])
            ->where('id', $id)
            ->where('is_public', true)->first();
        return $list != null ? response()->json($list, 200) : response()->json(null, 200);
    }

    public function update(Request $request, $id)
    {
        $curUser = auth()->user();
        DB::beginTransaction();

        try{
            $list = Evernotelist::with(['creator', 'notes', 'users'])
                ->where('id', $id)
                ->where(function ($query1) use ($curUser) {
                    $query1->where('created_by', $curUser->id)
                        ->orWhereHas('users', function ($query2) use ($curUser) {
                            $query2->where('id', $curUser->id)
                                ->where('is_accepted', true);
                        });
                })->first();

            if($list != null){
                $list->update($request->all());

                $ids = [];
                if(isset($request['users']) && is_array($request['users'])) {
                    foreach ($request['users'] as $user) {
                        array_push($ids, $user['id']);
                    }
                }

                $list->users()->sync($ids);
                $list->save();

            }

            DB::commit();

            $list1 = Evernotelist::where('id', $id)
                ->with(['creator', 'notes', 'users'])->first();

            return response()->json($list1, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Updating List failed: " . $e->getMessage(), 409);
        }
    }

    public function destroy($id)
    {
        $curUser = auth()->user();
        $list = Evernotelist::where('id', $id)
            ->where('created_by', $curUser->id)->first();
        if($list != null){
            $list->delete();
            return response()->json('List ('.$id.') successfully deleted', 204);
        }
        return response()->json('List ('.$id.') dose not exist', 422);
    }
}
