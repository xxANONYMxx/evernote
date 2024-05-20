import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Todo } from '../shared/todo';
import { List } from '../shared/list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EvernoteService } from '../shared/evernote.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'en-todo-details',
  standalone: true,
  imports: [TodoDetailsComponent, RouterLink],
  templateUrl: './todo-details.component.html',
  styles: ``
})
export class TodoDetailsComponent {
  @Input() todo:Todo | undefined;
  @Input() list:List | undefined;

  userId:number = Number(sessionStorage.getItem("userId"));

  constructor(
    public authService: AuthenticationService,
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ){}

  isAllowed(){
    return this.todo?.created_by == this.userId || this.todo?.assigned_to == this.userId || this.list?.users.find((u) => u.id == this.userId);
  }

  removeTodo(){
    if(confirm("Todo wirklich löschen?")){
      if(this.todo){
        this.es.removeTodo(this.todo.id.toString()).subscribe(
          ()=> {
            this.router.navigate(['../'], {relativeTo:this.route});
            this.toastr.success('Todo gelöscht!', "KWM Evernote");
          }
        );
      }
    }
  }
}
