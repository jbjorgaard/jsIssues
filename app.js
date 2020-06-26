import * as gui from "./teenygui.js";
const { $, $nodes, $find } = gui;
const objects = {};
let nextOid = 0;
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
const deleteObject = (id) => delete objects[id];
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
        note: `${note}`,
        summary: `${summary}`,
    }));
    const id = issue.id;
    // display object and bind fields
    const node = gui.bind(id, gui.clone("#issue"), update);
    // bind delete icon for this issue
    $find(node, "[name=close]").onclick = () => closeIssue(id);
    // add node to Page
    $("#issues").append(node);
}
function init() {
    gui.initGui((id) => objects[id]);
    $("#button-new-issue").onclick = () => createIssue("", "");
}
window.onload = init;
//# sourceMappingURL=app.js.map