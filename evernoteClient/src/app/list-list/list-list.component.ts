import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { List } from "../shared/list";
import { ListListItemComponent } from '../list-list-item/list-list-item.component';
import { EvernoteService } from '../shared/evernote.service';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';


import { Note } from "../shared/note";
import { Todo } from "../shared/todo";
import { Tag } from "../shared/tag";
import { User } from "../shared/user";

@Component({
  selector: 'en-list-list',
  standalone: true,
  imports: [ ListListItemComponent, RouterLink ],
  templateUrl: './list-list.component.html',
  styles: ``
})
export class ListListComponent implements OnInit {
  lists: List[] = [];

  constructor(
    private es: EvernoteService,
    public authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.es.getAllLists().subscribe(res => this.lists = res);
  }
}
