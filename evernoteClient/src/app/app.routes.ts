import { Routes } from '@angular/router';
import { ListListComponent } from './list-list/list-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { ListFormComponent } from './list-form/list-form.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ListSharedComponent } from './list-shared/list-shared.component';
import { TagFormComponent } from './tag-form/tag-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'lists', component: ListListComponent },
    { path: 'lists/:id', component: ListDetailsComponent },
    { path: 'edit/lists/:id', component: ListFormComponent },
    { path: 'edit/lists', component: ListFormComponent },
    { path: 'edit/notes/:id', component: NoteFormComponent },
    { path: 'edit/notes', component: NoteFormComponent },
    { path: 'edit/todos/:id', component: TodoFormComponent },
    { path: 'edit/todos', component: TodoFormComponent },
    { path: 'edit/tags/:id', component: TagFormComponent },
    { path: 'edit/tags', component: TagFormComponent },
    { path: 'todos', component: TodoListComponent },
    { path: 'shared', component: ListSharedComponent },
    { path: 'login', component:LoginComponent }
];
