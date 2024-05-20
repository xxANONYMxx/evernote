import { List } from "./list";
import { Tag } from "./tag";
import { Todo } from "./todo";

export class Note {
    constructor(
        public id:number,
        public list_id:number,
        public title:string,
        public created_by:number,
        public image?:string,
        public list?:List,
        public todos?:Todo[],
        public tags?:Tag[],
        public description?:string
    ){}
}
