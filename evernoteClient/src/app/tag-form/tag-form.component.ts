import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvernoteService } from '../shared/evernote.service'; // Adjust path as necessary
import { User } from '../shared/user';
import { List } from '../shared/list';
import { Tag } from '../shared/tag';

@Component({
  selector: 'en-tag-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tag-form.component.html',
  styles: ``
})
export class TagFormComponent {
  tagForm: FormGroup;
  tag = new Tag(0, '');
  isUpdatingTag = false;

  constructor(
    private fb: FormBuilder,
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tagForm = this.fb.group({
      id: [''],
      name: [''],
    });
  }

  ngOnInit(): void {
    const tagId = this.route.snapshot.params['id'];
    if (tagId) {
      this.isUpdatingTag = true;
      this.es.getSingleTag(tagId).subscribe(tag => {
        this.tag = tag;
        this.initForm();
      });
    } else {
      this.initForm();
    }
  }

  initForm(): void {
    this.tagForm = this.fb.group({
      id: [this.tag.id],
      name: [this.tag.name, Validators.required]
    });
  }

  submitForm(): void {
    if (this.tagForm.valid) {
      if (this.isUpdatingTag) {
        this.es.updateTag(this.tagForm.value).subscribe(() => {
          this.router.navigate(['/home']);
        });
      } else {
        this.es.createTag(this.tagForm.value).subscribe(() => {
          this.router.navigate(['/home']);
        });
      }
    }
  }
}
