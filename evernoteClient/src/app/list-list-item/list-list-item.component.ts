import { Component, Input } from '@angular/core';
import { List } from "../shared/list";

@Component({
  selector: 'a.en-list-list-item',
  standalone: true,
  imports: [],
  templateUrl: './list-list-item.component.html',
  styles: ``
})
export class ListListItemComponent {
  @Input() list:List | undefined;
}
