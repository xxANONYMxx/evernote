import { Component, Input } from '@angular/core';
import { Note } from '../shared/note';
import { TodoDetailsComponent } from '../todo-details/todo-details.component';
import { AuthenticationService } from '../shared/authentication.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { List } from '../shared/list';
import { ToastrService } from 'ngx-toastr';
import { EvernoteService } from '../shared/evernote.service';

@Component({
  selector: 'en-note-details',
  standalone: true,
  imports: [RouterLink, TodoDetailsComponent],
  templateUrl: './note-details.component.html',
  styles: ``
})
export class NoteDetailsComponent {
  @Input() note:Note | undefined;
  @Input() list:List | undefined;

  userId:number = Number(sessionStorage.getItem("userId"));

  constructor(
    private es: EvernoteService,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
    
  ){}

onCreateTodo(): void {
  if(this.note)
  sessionStorage.setItem('note_id', this.note.id.toString());
}

  isAllowed(){
    return this.list?.created_by == this.userId || this.list?.users.find((u) => u.id == this.userId);
  }

  removeNote(){
    if(confirm("Notiz wirklich löschen?")){
      if(this.note){
        this.es.removeNote(this.note.id.toString()).subscribe(
          ()=> {
            this.router.navigate(['../'], {relativeTo:this.route});
            this.toastr.success('Notiz gelöscht!', "KWM Evernote");
          }
        );
      }
    }
  }
}
