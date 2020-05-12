type ID = number;

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

export interface Task {
   id: ID;
   title: string;
   desc: string;
   parents: number[];
   children: number[];
   attachments: number[];
}
