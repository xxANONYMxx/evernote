import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { List } from "../shared/list";
import { ListListItemComponent } from '../list-list-item/list-list-item.component';
import { EvernoteService } from '../shared/evernote.service';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'en-list-shared',
  standalone: true,
  imports: [ListListItemComponent, RouterLink],
  templateUrl: './list-shared.component.html',
  styles: ``
})
export class ListSharedComponent {
  lists: List[] = [];

  constructor(
    private es: EvernoteService,
    public authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.es.getSharedLists().subscribe(res => this.lists = res);
  }

  onAccept(list_id:string){
    this.es.acceptInvite(list_id).subscribe();
    this.ngOnInit();
  }
}