import { Note } from "./note";
import { User } from "./user";

export class List {
    constructor(
        public id:number,
        public name:string,
        public created_by:number,
        public is_public:boolean,
        public creator:User,
        public users:User[],
        public notes?:Note[]
    ){}
}
