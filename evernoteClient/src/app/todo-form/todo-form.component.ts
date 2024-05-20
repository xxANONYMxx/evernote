import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvernoteService } from '../shared/evernote.service'; // Adjust path as necessary
import { Tag } from '../shared/tag';
import { Note } from '../shared/note';
import { Todo } from '../shared/todo';
import { User } from '../shared/user';

@Component({
  selector: 'en-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styles: ``
})
export class TodoFormComponent {
  todoForm: FormGroup;
  todo = new Todo(0, '', new Date, 0, new User(0, '', '', '', false));
  isUpdatingTodo = false;
  tags: FormArray;

  availableTags:Tag[] = [];
  addedTag:Tag = new Tag(-1, '');

  availableUsers:User[] = [];

  constructor(
    private fb: FormBuilder,
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.todoForm = this.fb.group({
      id: [''],
      note_id: [''],
      title: [''],
      due_date: [new Date],
      description: [''],
      assigned_to: [''],
      tags: []
    });
    this.tags = this.fb.array([]);
  }

  ngOnInit(): void {
    const todoId = this.route.snapshot.params['id'];
    if (todoId) {
      this.isUpdatingTodo = true;
      this.es.getSingleTodo(todoId).subscribe(todo => {
        this.todo = todo;
        this.initForm();

        this.es.getAddAbleTagsTodo(todoId).subscribe(tags => {
          this.availableTags = tags;
          
        });

        this.es.getAssignableUsersTodo(todoId).subscribe(users => {
          this.availableUsers = users;
          if(this.todo.assignee)
            this.availableUsers.push(this.todo.assignee);
        })


      });
    } else {
      this.todo.note_id = Number(sessionStorage.getItem('note_id'));

      this.es.getAddAbleTagsTodo('-1').subscribe(tags => {
        this.availableTags = tags;
      });

      if(this.todo.note_id){
        this.es.getSingleNote(this.todo.note_id.toString()).subscribe(note => {
          this.es.getSingleList(note.list_id.toString()).subscribe(list => {
            this.availableUsers = list.users.filter(u => u.pivot?.is_accepted);
            this.availableUsers.push(list.creator);
          });
        });
      } else {
        this.es.getCurrentUser().subscribe(u => {
          this.availableUsers.push(u);
        });
      }

      this.initForm();
    }
  }

  initForm(): void {
    this.buildTagsArray();
    this.todoForm = this.fb.group({
      id: [this.todo.id],
      note_id: [this.todo.note_id],
      title: [this.todo.title, Validators.required],
      due_date: [this.todo.due_date, Validators.required],
      description: [this.todo.description],
      assigned_to: [this.todo.assigned_to],
      tags: this.tags
    });
  }

  buildTagsArray(){
    if(this.todo.tags){
      this.tags = this.fb.array([]);

      for(let tag of this.todo.tags){
        let fg = this.fb.group({
          id: new FormControl(tag.id),
          name: new FormControl(tag.name)
        });
        this.tags.push(fg);
      }
    }
  }

  addTagControl(id:string): void {
    this.addedTag = this.availableTags.find(t => t.id == Number(id)) || new Tag(-1, '');
    if(this.addedTag.id != -1){
      this.tags.push(this.fb.group({ id: this.addedTag.id, name: this.addedTag.name }));
      this.availableTags = this.availableTags.filter(t => t.id !== this.addedTag.id);
      this.addedTag = new Tag(-1, '');
    }
  }

  removeTagControl(index: number): void {
    const removedTag = this.tags.at(index).value;
    if (!this.availableTags.some(u => u.id === removedTag.id)) {
      this.availableTags.push( new Tag(
        removedTag.id,
        removedTag.name
      ));
    }

    this.tags.removeAt(index);
  }

  submitForm(): void {
    if (this.todoForm.valid) {
      if (this.isUpdatingTodo) {
        this.es.updateTodo(this.todoForm.value).subscribe(() => {
          this.router.navigate(['/todos']);
        });
      } else {
        console.log(this.todoForm.value);
        if(this.todoForm.value.note_id == 0){
          delete this.todoForm.value.note_id;
        }
        this.es.createTodo(this.todoForm.value).subscribe(() => {
          this.router.navigate(['/todos']);
        });
      }
    }
  }
}
