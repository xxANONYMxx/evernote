import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Todo } from "../shared/todo";
import { TodoDetailsComponent } from '../todo-details/todo-details.component';
import { EvernoteService } from '../shared/evernote.service';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { Tag } from '../shared/tag';

@Component({
  selector: 'en-todo-list',
  standalone: true,
  imports: [TodoDetailsComponent, RouterLink],
  templateUrl: './todo-list.component.html',
  styles: ``
})
export class TodoListComponent {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  tags: Tag[] = [];

  constructor(
    private es: EvernoteService,
    public authService: AuthenticationService
  ) {}

  onCreateTodo(): void {
    sessionStorage.removeItem('note_id');
  }

  ngOnInit(): void {
    this.loadTodos();
    this.loadTags();

  }

  loadTodos(): void {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.es.getAssignedOrCreatedTodos(userId).subscribe(res => {
        this.todos = res;
        this.filterTodos(undefined);
      });
    }
  }

  onSelectTag(id:string): void {
    this.filterTodos(Number(id));
  }

  loadTags(): void {
    this.es.getAllTags().subscribe(res => this.tags = res);
  }

  filterTodos(id?:number): void {
    if (id) {
      this.filteredTodos = this.todos.filter(todo => 
        todo.tags?.some(tag => tag.id === id));
    } else {
      this.filteredTodos = this.todos;
    }
  }
}
