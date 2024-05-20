<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EvernotelistController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('auth/login', [AuthController::class,'login']);

//Todo: add userid on gets deletes and updates
//lists
Route::get('/', [EvernotelistController::class, 'index']);
Route::get('/lists', [EvernotelistController::class, 'index']);
Route::get('/lists/{id}', [EvernotelistController::class, 'show']);

Route::group(['middleware' => ['api','auth.jwt']], function() {
    Route::get('/invites', [EvernotelistController::class, 'sharedPending']);
    Route::get('/inviteable/{id}', [EvernotelistController::class, 'getInviteableUsers']);

    Route::put('/invites/{id}', [EvernotelistController::class, 'acceptInv']);
    Route::post('/lists', [EvernotelistController::class, 'store']);
    Route::put('/lists/{id}', [EvernotelistController::class, 'update']);
    Route::delete('/lists/{id}', [EvernotelistController::class, 'destroy']);

    //notes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::get('/notes/{id}', [NoteController::class, 'show']);
    Route::get('/addAbleTags/note/{id}', [NoteController::class, 'getAddableTags']);

    Route::post('/notes', [NoteController::class, 'store']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);

    //todos
    Route::get('/todos', [TodoController::class, 'index']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::get('/assignedOrCreated/todos/{id}', [TodoController::class, 'getAssignedOrCreatedTodos']);
    Route::get('/addAbleTags/todo/{id}', [TodoController::class, 'getAddableTags']);
    Route::get('/assignableUsers/todo/{id}', [TodoController::class, 'getAssignableUsers']);

    Route::post('/todos', [TodoController::class, 'store']);
    Route::put('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);

    //tags
    Route::get('/tags', [TagController::class, 'index']);
    Route::get('/tags/{id}', [TagController::class, 'show']);

    //Users
    Route::get('/user', [UserController::class, 'show']);
});
Route::group(['middleware'=>['api','auth.jwt','auth.admin']], function() {
    Route::post('/tags', [TagController::class, 'store']);
    Route::put('/tags/{id}', [TagController::class, 'update']);
    Route::delete('/tags/{id}', [TagController::class, 'destroy']);
});
