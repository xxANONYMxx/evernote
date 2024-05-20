<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::all();
        return response()->json($tags, 200);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $tag = Tag::create($request->all());
            DB::commit();
            return response()->json($tag, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Saving Tag failed: " . $e->getMessage(), 409);
        }


    }

    public function show($id)
    {
        $tag = Tag::where('id', $id)->first();
        return $tag != null ? response()->json($tag, 200) : response()->json(null, 200);
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try{
            $tag = Tag::where('id', $id)->first();
            if($tag != null) {
                $tag->update($request->all());
            }

            DB::commit();

            $tag1 = Tag::where('id', $id)->first();

            return response()->json($tag1, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json("Updating Tag failed: " . $e->getMessage(), 409);
        }
    }

    public function destroy($id)
    {
        $tag = Tag::where('id', $id)->first();
        if($tag != null){
            $tag->delete();
            return response()->json('Tag ('.$id.') successfully deleted', 204);
        }
        return response()->json('Tag ('.$id.') dose not exist', 422);
    }
}
