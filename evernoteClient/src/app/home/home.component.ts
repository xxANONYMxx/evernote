import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListListItemComponent } from '../list-list-item/list-list-item.component';
import { EvernoteService } from '../shared/evernote.service';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../shared/user';
import { ToastrService } from 'ngx-toastr';
import { Tag } from '../shared/tag';

@Component({
  selector: 'en-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  user: User = new User(0, '', '', '', false);
  tags: Tag[] = [];

  constructor(
    private es: EvernoteService,
    public authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.es.getCurrentUser().subscribe(res => {
      this.user = res
      if(this.user.admin == true){
        this.es.getAllTags().subscribe(tags => {
            this.tags = tags;
        });
      }
    });
  }

  removeTag(tag_id:number){
    if(confirm("Tag wirklich löschen?")){
      this.es.removeTag(tag_id.toString()).subscribe(
        ()=> {
          if(this.user.admin == true){
            this.es.getAllTags().subscribe(tags => {
                this.tags = tags;
            });
          }
          this.toastr.success('Tag gelöscht!', "KWM Evernote");
        }
      );
    }
  }
}
