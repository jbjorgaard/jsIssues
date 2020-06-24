import * as gui from './tinygui.js';
const {$, $nodes, $find} = gui;

let {request, db, tx, store, index} = '';

if (!window.indexedDB) {
  console.log('No indexedDb available');
} else {
  console.log('indexedDb available');
}

function clearIndexedDB() {
  window.indexedDB.databases().then((r) => {
      for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
  }).then(() => {
      console.log('All data cleared.');
  });
}

function openDatabase() {
  request = window.indexedDB.open("IssueDatabase", 1);
  request.onupgradeneeded = (e)=> {
    let db = request.result,
    store = db.createObjectStore('IssueStore', {
      autoIncrement: true});
      console.log('database created');
  }
  request.onerror = (e)=> { console.log("There was an error: " + e.target.errorCode); };
  request.onsuccess = (e)=> {
    db = request.result;
    tx = db.transaction("IssueStore", "readwrite");
    store = tx.objectStore("IssueStore");

    db.onerror = (e)=> { console.log("There was an error: " + e.target.errorCode); };
    console.log('database opened');

    // store.put({
    //   summary: 'Testing summary',
    //   note: 'This is a test'
    // });
    // let issueData = store.get(1);
    // issueData.onsuccess = ()=> {
    //   console.log(issueData.result.summary);
    // };
    tx.oncomplete = ()=> { db.close(); };
  }
}

const objects = {};
var nextOid = 0;

class Issue {
    constructor(obj) {
        Object.assign(this, obj);
    }
}

function update(id, field, value) {
    const issue = objects[id];

    issue[field] = value;
    console.log(`ISSUE CHANGED[${field}]: ${id}: ${JSON.stringify(issue)}`);
}

function addObject(obj) {
    obj.id = nextOid++;
    objects[obj.id] = obj;
    return obj;
}

const deleteObject = (id)=> delete objects[id];

function closeIssue(id) {
    for (let node of $nodes(id)) {
        node.remove();
    }
    deleteObject(id);
}

function deleteIssue(id) {
  // performs closeIssue and also removes data from indexedDb
  closeIssue(id);
}

function createIssue(sum, text) {
  const summary = sum;
  const note = text;
  const issue = addObject(new Issue({
    summary: `${summary}`,
    note: `${note}`
  }));
  const id = issue.id;
  // dispay object and bind fields
  const node = gui.bind(id, gui.clone('#issue'), update);

  // bind delete icon for this person
  $find(node, '[name=close]').onclick = ()=> closeIssue(id)
  // add node to page
  $('#issues').append(node);
}

function init() {
    gui.initGui((id)=> objects[id]);
    $('#button-new-issue').onclick = ()=> createIssue('','');
}

window.onload = init;
