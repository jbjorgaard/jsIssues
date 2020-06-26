/*
   Copyright (C) 2020, Bill Burdick
   The MIT License (MIT)
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
*/
export { initGui, $, $all, $find, $findAll, $nodes, clone, refresh, show, bind };
var getObject; // this connects the view to the model
const initGui = (getObjectFunc) => getObject = getObjectFunc; // init the presentation layer
// find things
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => document.querySelectorAll(sel);
const $find = (el, sel) => el.querySelector(sel);
const $findAll = (el, sel) => el.querySelectorAll(sel);
const $nodes = (id) => $all(`[x-oid="${checkId(id)}"]`);
function checkId(id) {
    if (typeof id != 'number' && typeof id != 'string')
        throw new Error(`Expected ID but got ${id}`);
    return id;
}
// clone a template with x-field attributes linking it to a model
function clone(sel, optionalParent) {
    var node = (optionalParent ? $find(optionalParent, sel) : $(sel)).cloneNode(true);
    node.removeAttribute('id');
    return node;
}
// redisplay nodes (like when the model changes)
const refresh = (id) => $nodes(id).forEach(show);
// show object's fields in node (text inputs and spans/divs)
function show(node) {
    var obj = getObject(node.getAttribute('x-oid'));
    for (let field of $findAll(node, '[x-field]')) {
        if (field.matches('input[type=text]')) {
            field.value = obj[field.getAttribute('x-field')];
        }
        else {
            field.textContent = obj[field.getAttribute('x-field')];
        }
    }
    return node;
}
// add a node to the presentation
// updater is (id, fieldName, fieldValue)=> CODE TO UPDATE MODEL
function bind(id, node, updater) {
    node.setAttribute('x-oid', String(checkId(id)));
    for (let field of $findAll(node, 'input[type=text][x-field],textarea[x-field]')) {
        field.onchange = () => updater(id, field.getAttribute('x-field'), field.value);
    }
    return show(node);
}
//# sourceMappingURL=teenygui.js.map