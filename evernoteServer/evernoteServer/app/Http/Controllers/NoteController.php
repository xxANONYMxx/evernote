<?php

namespace App\Http\Controllers;

use App\Models\Evernotelist;
use App\Models\Note;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    public function index()
    {
        $curUser = auth()->user();
        if($curUser != null){
            $notes = Note::with(['list', 'creator', 'todos', 'tags'])->whereHas('list', function ($query) use ($curUser) {
                $query->where('is_public', 1)
                    ->orwhere('created_by', $curUser->id,)
                    ->orWhereHas('users', function ($query) use ($curUser) {
                        $query->where('id', $curUser->id)
                            ->where('is_accepted', true);
                    });
            })->get();
            return response()->json($notes, 200);
        }

        $notes = Note::with(['list', 'creator', 'todos', 'tags'])->whereHas('list', function ($query) {
            $query->where('is_public', 1);
        })->get();
        return response()->json($notes, 200);
    }

    public function getAddableTags($id)
    {
        $curUser = auth()->user();
        $note = Note::with('tags')->find($id);
        if($note){
            $excludedTagIds = $note->tags->pluck('id')->toArray();

            $addableTags = Tag::whereNotIn('id', $excludedTagIds)->get();

            return response()->json($addableTags);
        }

        if($id == '-1'){
            $addableTags = Tag::all();

            return response()->json($addableTags);
        }

        return response()->json('no note found', status: 404);
    }

    public function store(Request $request)
    {
        $curUser = auth()->user();
        $request->merge(['created_by' => $curUser->id]);

        $list = Evernotelist::where('id', $request['created_by'])
            ->where(function ($query) use ($curUser) {
                $query->where('is_public', 1)
                    ->orwhere('created_by', $curUser->id,)
                    ->orWhereHas('users', function ($query) use ($curUser) {
                        $query->where('id', $curUser->id)
                            ->where('is_accepted', true);
                    })->get();
            })->first();
        if(!$list){
            return response()->json('No list for note found!', 404);
        }

        DB::beginTransaction();

        try {
            $note = Note::create($request->all());
            $note->save();

            if(isset($request['tags']) && is_array($request['tags'])){
                foreach ($request['tags'] as $tag) {
                    $dbTag = Tag::firstOrNew([
                        'name' => $tag['name']
                    ]);
                    $note->tags()->sync($dbTag);
                }
            }

            DB::commit();

            return response()->json($note, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving Note failed: " . $e->getMessage(), 409);
        }


    }

    public function show($id)
    {
        $curUser = auth()->user();

        $note = Note::where('id', $id)
            ->with(['list', 'creator', 'todos', 'tags'])->first();

        $list = Evernotelist::where('id', $note->list->id)
            ->where(function ($query) use ($curUser) {
                $query->where('is_public', 1)
                    ->orwhere('created_by', $curUser->id,)
                    ->orWhereHas('users', function ($query) use ($curUser) {
                        $query->where('id', $curUser->id)
                            ->where('is_accepted', true);
                    })->get();
            })
            ->with(['creator', 'notes', 'users'])->first();
        if(!$list){
            return response()->json('Unauthorized to view Note', 401);
        }


        return $note != null ? response()->json($note, 200) : response()->json(null, 200);
    }

    public function update(Request $request, $id)
    {

        DB::beginTransaction();

        try{
            $note = Note::with(['list', 'creator', 'todos', 'tags'])
                ->where('id', $id)->first();

            if($note != null) {
                $note->update($request->all());


                $ids = [];
                if (isset($request['tags']) && is_array($request['tags'])) {
                    foreach ($request['tags'] as $tag) {
                        array_push($ids, $tag['id']);
                    }
                }

                $note->tags()->sync($ids);
                $note->save();
            }

            DB::commit();

            $note1 = Note::with(['list', 'creator', 'todos', 'tags'])
                ->where('id', $id)->first();

            return response()->json($note1, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Updating Note failed: " . $e->getMessage(), 409);
        }
    }

    public function destroy($id)
    {
        $note = Note::where('id', $id)->first();
        if($note != null){
            $note->delete();
            return response()->json('Note ('.$id.') successfully deleted', 204);
        }
        return response()->json('Note ('.$id.') dose not exist', 422);
    }
}
