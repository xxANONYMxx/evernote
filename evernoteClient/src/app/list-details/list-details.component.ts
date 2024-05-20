import { Component, OnInit } from '@angular/core';
import { List } from "../shared/list";
import { User } from '../shared/user';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../shared/authentication.service';
import { NoteDetailsComponent } from '../note-details/note-details.component';



@Component({
  selector: 'en-list-details',
  standalone: true,
  imports: [RouterLink, NoteDetailsComponent],
  templateUrl: './list-details.component.html',
  styles: ``
})
export class ListDetailsComponent implements OnInit{
  list:List = new List(0, '', 0, false, new User(0, '', '', '', false), []);
  userId:number = Number(sessionStorage.getItem("userId"));

  constructor (
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthenticationService
  ) {}

  ngOnInit(){
    const params = this.route.snapshot.params;
    this.es.getSingleList(params['id']).subscribe(res => {
      this.list = res;
      sessionStorage.setItem('list_id', this.list.id.toString());
    });
  }

  isAllowed(){
    return this.list.created_by == this.userId || this.list?.users.find((u) => u.id == this.userId);
  }

  removeList() {
    if(confirm("Liste wirklich löschen?")){
      this.es.removeList(this.list.id.toString()).subscribe(
        ()=> {
          this.router.navigate(['../'], {relativeTo:this.route});
          this.toastr.success('Liste gelöscht!', "KWM Evernote");
        }
      );
    }
  }
}
