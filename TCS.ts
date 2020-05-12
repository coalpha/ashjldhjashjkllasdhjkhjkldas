import { TaskImmutable as TI } from "./Task"

export default interface TCS {
   setTitle(task: TI, title: string): void;
   setDesc(task: TI, desc: string): void;
   addBinding(parent: TI, child: TI): void;
   removeBinding(parent: TI, child: TI): void;
   dropParents(t: TI): void;
   dropChildren(t: TI): void;
}
