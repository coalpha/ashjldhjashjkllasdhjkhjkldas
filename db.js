const fs = require("fs");
const mkdirp = require("mkdirp").sync;
const DatabaseDriver = require("better-sqlite3");

const dataPath = "db";
const dbPath = `${dataPath}/data.db`;
const dbProvisionedPath = `${dataPath}/.dbprovisioned`;

mkdirp(dataPath);

const dbProvisioned = fs.existsSync(dbProvisionedPath);

console.log({dataPath, dbPath, dbProvisionedPath});

const db = new DatabaseDriver(dbPath, { verbose: console.log });

if (!dbProvisioned) {
   db.pragma("foreign_keys = ON");
   db.pragma("journal_mode = WAL");
   db.exec(`
      create table Nodes(
         id integer primary key,
         title text
      )
   `);
   db.exec(`
      create table AdjList(
         parent_id integer primary key,
         child_id integer,
         node_order integer
      )
   `);
   fs.writeFileSync(dbProvisionedPath);
}

/** @typedef {import("./AdjList").AdjList} AdjList */
/** @typedef {import("./Node").Node} Node */

const db_BEGIN = db.prepare("begin transaction");
const db_COMMIT = db.prepare("commit");


const db_getNodeRows = db.prepare("select * from Nodes");
db_getNodeRows.raw(true);
/** @returns {Node[]} */
function getNodes() {
   const nodeRows = db_getNodeRows.all();
   /** @type {Node[]} */
   const out = [];
   for (const [id, title] of nodeRows) {
      out[id] = { id, title };
   }
   return out;
}

const db_pushNodeRow = db.prepare("insert into Nodes values (?, ?)");
/** @param {Node} node */
function pushNode(node) {
   db_pushNodeRow.run(node.id, node.title);
}

/** @param {Node[]} nodes */
function pushNodes(nodes) {
   db_BEGIN.run();
   for (const node of nodes) {
      pushNode(node);
   }
   db_COMMIT.run();
}

const db_removeNodeRow = db.prepare("delete from Nodes where id = ?");
/** @param {number} id */
function removeNode(id) {
   db_removeNodeRow.run(id);
}

const db_getAdjListRows = db.prepare("select * from AdjList");
db_getAdjListRows.raw(true);
/** @returns {AdjList} */
function getAdjList() {
   /** @type {import("./AdjList").AdjListDBRow[]} */
   const adjListRows = db_getAdjListRows.all();
   /** @type {AdjList} */
   const out = {};
   for (const [parent_id, child_id, order] of adjListRows) {
      out[parent_id] = [child_id, order];
   }
   return out;
}

const db_pushAdjListRow = db.prepare("insert into AdjList values (?, ?, ?)");
/** @param {AdjList} list */
function pushAdjList(list) {
   db_BEGIN.run();
   for (const [parent_id, [child_id, node_order]] of Object.entries(list)) {
      db_pushAdjListRow.run(parent_id|0, child_id|0, node_order|0);
   }
   db_COMMIT.run();
}

module.exports = {
   getNodes,
   pushNode,
   pushNodes,
   removeNode,
   getAdjList,
   pushAdjList,
};
