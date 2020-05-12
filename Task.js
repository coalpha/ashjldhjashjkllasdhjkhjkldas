/** @type {import("./Task").Task} */
class Task {
   constructor (id, title, desc) {
      this.id = id;
      this.title = title;
      this.desc = desc;
      this.parents = null;
      this.children = [];
   }
}

module.exports = Task;
