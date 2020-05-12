const rl = require("readline-sync");
const uuidv4 = require("uuid").v4;

const db = require("./db");

let selectedId = null;

rl.promptCLLoop({
   list() {
      console.log(db.list());
   },
   add(title, desc) {
      db.addTask({
         title,
         desc,
      });
   },
   select(id) {
      selectedId = id|0;
      console.log(`${selectedId} selected`);
   },
   add_child(id) {
      if (selectedId === null) {
         console.log("guh");
         return;
      }
      db.addChild(selectedId, id);
   },
   exit() {
      process.exit(0);
   },
   remove(id) {
      db.remove(id);
   },
   help() {
      console.log(Object.keys(this));
   },
});
