const fs = require("fs");
const bsqlite3 = require("better-sqlite3");

const db_exists = fs.existsSync("db/data.db");

if (!db_exists) {
   fs.mkdirSync("db");
}

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

module.exports = db;

const addTask_stmt = db.prepare(`
   insert into tasks (task_title, task_desc)
   values (?, ?)
`);

/**
 * @param {import("./types").Task} task
 */
function addTask(task) {
   addTask_stmt.run(task.title, task.desc);
}


const addChild_stmt = db.prepare("insert into bindings values (?, ?)");
function addChild(parent_id, child_id) {
   addChild_stmt.run(parent_id|0, child_id|0);
}

const list_stmt = db.prepare("select * from tasks");

function list() {
   return list_stmt.all();
}

const remove_stmt = db.prepare("delete from tasks where task_id = ?");
function remove(id) {
   remove_stmt.run(id|0);
}

module.exports = {
   addTask, list, addChild, remove,
};
