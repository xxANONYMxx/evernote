import { Note } from "./note";
import { Tag } from "./tag";
import { User } from "./user";

export class Todo {
    constructor(
        public id:number,
        public title:string,
        public due_date:Date,
        public created_by:number,
        public creator:User,
        public description?:string,
        public note_id?:number,
        public note?:Note,
        public assigned_to?:number,
        public assignee?:User,
        public tags?:Tag[]
    ){}
}
