import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvernoteService } from '../shared/evernote.service'; // Adjust path as necessary
import { Tag } from '../shared/tag';
import { Note } from '../shared/note';

@Component({
  selector: 'en-note-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './note-form.component.html',
  styles: ``
})
export class NoteFormComponent implements OnInit{
  noteForm: FormGroup;
  note = new Note(0, -1, '', -1);
  isUpdatingNote = false;
  tags: FormArray;

  availableTags:Tag[] = [];
  addedTag:Tag = new Tag(-1, '');

  constructor(
    private fb: FormBuilder,
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.noteForm = this.fb.group({
      id: [''],
      list_id: [''],
      title: [''],
      description: [''],
      image: ['']
    });
    this.tags = this.fb.array([]);
  }

  ngOnInit(): void {
    const noteId = this.route.snapshot.params['id'];
    if (noteId) {
      this.isUpdatingNote = true;
      this.es.getSingleNote(noteId).subscribe(note => {
        this.note = note;
        this.initForm();

        this.es.getAddAbleTagsNote(noteId).subscribe(tags => {
          this.availableTags = tags;
          
        });
      });
    } else {
      this.note.list_id = Number(sessionStorage.getItem('list_id'));
      this.es.getAddAbleTagsNote('-1').subscribe(tags => {
        this.availableTags = tags;
        
      });

      this.initForm();
    }
  }

  initForm(): void {
    this.buildTagsArray();
    this.noteForm = this.fb.group({
      id: [this.note.id],
      list_id: [this.note.list_id, Validators.required],
      title: [this.note.title, Validators.required],
      description: [this.note.description],
      image: [this.note.image],
      tags: this.tags,
      lists: [this.note.list_id]
    });
  }

  buildTagsArray(){
    if(this.note.tags){
      this.tags = this.fb.array([]);

      for(let tag of this.note.tags){
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
      this.availableTags = this.availableTags.filter(u => u.id !== this.addedTag.id);
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
    if (this.noteForm.valid) {
      if (this.isUpdatingNote) {
        this.es.updateNote(this.noteForm.value).subscribe(() => {
          this.router.navigate(['/lists']);
        });
      } else {
        this.es.createNote(this.noteForm.value).subscribe(() => {
          this.router.navigate(['/lists']);
        });
      }
    }
  }
}
