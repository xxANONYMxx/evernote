import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvernoteService } from '../shared/evernote.service'; // Adjust path as necessary
import { User } from '../shared/user';
import { List } from '../shared/list';

@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './list-form.component.html',
  styles: ``
})
export class ListFormComponent implements OnInit {
  listForm: FormGroup;
  list = new List(0, '', 0, false, new User(0, '', '', '', false), [], []);
  isUpdatingList = false;
  users: FormArray;
  
  availableUsers:User[] = [];
  addedUser:User = new User(-1, '', '', '', false);

  constructor(
    private fb: FormBuilder,
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.listForm = this.fb.group({
      id: [''],
      name: [''],
      users: [''],
      is_public: false
    });
    this.users = this.fb.array([]);
  }

  ngOnInit(): void {
    const listId = this.route.snapshot.params['id'];
    if (listId) {
      this.isUpdatingList = true;
      this.es.getSingleList(listId).subscribe(list => {
        this.list = list;
        this.initForm();

        this.es.getAvailableUsers(listId).subscribe(users => {
          this.availableUsers = users;
          
        });
      });
    } else {
      this.es.getAvailableUsers('-1').subscribe(users => {
        this.availableUsers = users;
        
      });

      this.initForm();
    }
  }

  initForm(): void {
    this.buildUsersArray();
    this.listForm = this.fb.group({
      id: [this.list.id],
      name: [this.list.name, Validators.required],
      is_public: [this.list.is_public],
      users: this.users
    });
  }

  buildUsersArray(){
    if(this.list.users){
      this.users = this.fb.array([]);

      for(let user of this.list.users){
        let fg = this.fb.group({
          id: new FormControl(user.id),
          first_name: new FormControl(user.first_name),
          last_name: new FormControl(user.last_name)
        });
        this.users.push(fg);
      }
    }
  }

  addUserControl(id:string): void {
    this.addedUser = this.availableUsers.find(u => u.id == Number(id)) || new User(0, '', '', '', false);
    if(this.addedUser.id != -1){
      this.users.push(this.fb.group({ id: this.addedUser.id, first_name: this.addedUser.first_name, last_name: this.addedUser.last_name }));
      this.availableUsers = this.availableUsers.filter(u => u.id !== this.addedUser.id);
      this.addedUser = new User(-1, '', '', '', false);
    }
  }

  removeUserControl(index: number): void {
    const removedUser = this.users.at(index).value;
    if (!this.availableUsers.some(u => u.id === removedUser.id)) {
      this.availableUsers.push( new User(
        removedUser.id,
        removedUser.first_name,
        removedUser.last_name,
        '',
        false
      ));
    }

    this.users.removeAt(index);
  }


  submitForm(): void {
    if (this.listForm.valid) {
      if (this.isUpdatingList) {
        this.es.updateList(this.listForm.value).subscribe(() => {
          this.router.navigate(['/lists']);
        });
      } else {
        this.es.createList(this.listForm.value).subscribe(() => {
          this.router.navigate(['/lists']);
        });
      }
    }
  }
}
