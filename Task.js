/** @type {import("./Task").Task} */
class Task {
   constructor (id, title, desc) {
      this.id = id;
      this.title = title;
      this.desc = desc;
      this.parents = [];
      this.children = [];
      this.attachments = [];
   }
}

module.exports = Task;
