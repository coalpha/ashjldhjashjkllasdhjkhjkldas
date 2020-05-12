type id = number;

interface Item {
   id: id,

	title: string,
	desc: string,
	date: Date,
	color: string

	parents: Item[],
	children: Item[];
}


interface List extends Item {
	background: string;
}

function remove(ary: any[]) {
   return function remove(ptr: Object) : boolean {
 	  const idx = ary.findIndex((o: object) => o === ptr);
		if (idx !== -1 ) {
			ary.splice(idx, 1);
			return true;
		}
		return false;
	}
}

function removeParent(ecs: ECS, parent: Item, child: Item) {
	remove(child.parents)(parent);
	do {
		child.parents.length && ecs.deleteItem(child);
	} while (false);
}

interface ECS {
   newItem(parent: Item): Item;
   addConnection(parent: Item, child: Item): void;
   removeConnection(parent: Item, child: Item): void;
	deleteItem(t: Item): void;
	global: Item[];
}

function getIdFromDatabase (): number {
   return 1;
}

import bsqlite3 from "better-sqlite3";

import fs from "fs";

const db_exists = fs.existsSync("db/data.db");

const db = new bsqlite3("db/data.db", { verbose: console.log });

if (!db_exists) {
   try {
      fs.mkdirSync("db");
   } catch (e) { }
   db.pragma("foreign_keys = ON");
   db.pragma("journal_mode = WAL");
   db.exec(`
      create table tasks(
         task_id integer primary key autoincrement,
         task_title text,
         task_desc text
      )
   `);
   db.exec(`
      create table bindings(
         parent_task_id integer primary key,
         child_task_id integer
      )
   `);
}

class LocalECS implements ECS {
   global: Item[] = [];
	newItem(parent: Item): Item {
		const id : number = getIdFromDatabase();
		const newitem : Item = {
			id,
			title: "" + id,
			desc: "",
         color: "greeen",
         date: new Date,

			parents: [parent],
			children: []
		};
		parent.children.push(newitem);
		this.global.push(newitem);
      return newitem;
	}

   addConnection(parent: Item, child: Item) {
      parent.children.push(child);
      child.parents.push(parent);
	}
	
	removeConnection(parent: Item, child: Item) {
		remove(parent.children)(child);
		removeParent(this, parent, child);
   }

   deleteItem(i: Item): void {
      remove(this.global)(i);
		
      for (const parent of i.parents) {
         remove(parent.children)(i);
      }

      for (const child of i.children) {
			removeParent(this, i, child);
      }
   }
}

function test() {
   const myecs: ECS = new LocalECS;
   const todaystasks: Item[] = myecs.getTasks("2020.05.11");
   todaystasks[0].setTitle("1");
}
