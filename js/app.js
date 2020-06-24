import * as gui from './tinygui.js';
const {$, $nodes, $find} = gui;

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

function deleteIssue(id) {
    for (let node of $nodes(id)) {
        node.remove();
    }
    deleteObject(id);
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
  $find(node, '[name=close]').onclick = ()=> deleteIssue(id)
  // add node to page
  $('#issues').append(node);
}

function init() {
    gui.initGui((id)=> objects[id]);
    $('#button-new-issue').onclick = ()=> createIssue('','');
}

window.onload = init;
