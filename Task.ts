type ID = number;
type TASK_UUID = ID;
type FILE_UUID = ID;

/**
 * Don't try modifying this because it doesn't do anything
 */
export interface TaskImmutable {
   /** readonly */
   readonly id: ID;
   /** readonly */
   readonly title: string;
   /** readonly */
   readonly desc: string;
   /** readonly */
   readonly parents: readonly TASK_UUID[];
   /** readonly */
   readonly children: readonly TASK_UUID[];
   /** readonly */
   readonly attachments: readonly FILE_UUID[];
   toString(): string;
}

export interface Task extends TaskImmutable {
   id: ID;
   title: string;
   desc: string;
   parents: TASK_UUID[];
   children: TASK_UUID[];
   attachments: FILE_UUID[];
}
