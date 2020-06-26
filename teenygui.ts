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

export { initGui, $, $all, $find, $findAll, $nodes, clone, refresh, show, bind, ObId };

type ObId = string | number
type GetObFunc = (id: ObId) => any
type UpdateFunc = (id: string, field: string, value: string) => void
type HTMLOrSVG = HTMLElement | SVGElement

var getObject: GetObFunc // this connects the view to the model

const initGui = (getObjectFunc: GetObFunc) => getObject = getObjectFunc // init the presentation layer

// find things
const $ = (sel: string) => document.querySelector(sel) as HTMLOrSVG

const $all = (sel: string) => document.querySelectorAll(sel) as NodeListOf<HTMLOrSVG>

const $find = (el: HTMLOrSVG, sel: string): HTMLOrSVG => el.querySelector(sel)

const $findAll = (el: HTMLOrSVG, sel: string): NodeListOf<HTMLOrSVG> => el.querySelectorAll(sel)

const $nodes = (id: ObId) => $all(`[x-oid="${checkId(id)}"]`)

function checkId(id: any) {
    if (typeof id != 'number' && typeof id != 'string') throw new Error(`Expected ID but got ${id}`)
    return id
}

// clone a template with x-field attributes linking it to a model
function clone(sel: string, optionalParent?: HTMLOrSVG) {
    var node = (optionalParent ? $find(optionalParent, sel) : $(sel)).cloneNode(true) as HTMLOrSVG

    node.removeAttribute('id')
    return node
}

// redisplay nodes (like when the model changes)
const refresh = (id: ObId) => $nodes(id).forEach(show)

// show object's fields in node (text inputs and spans/divs)
function show(node: HTMLOrSVG) {
    var obj = getObject(node.getAttribute('x-oid'))

    for (let field of $findAll(node, '[x-field]')) {
        if (field.matches('input[type=text]')) {
            (field as HTMLInputElement).value = obj[field.getAttribute('x-field')]
        } else {
            field.textContent = obj[field.getAttribute('x-field')]
        }
    }
    return node
}

// add a node to the presentation
// updater is (id, fieldName, fieldValue)=> CODE TO UPDATE MODEL
function bind(id: string, node: HTMLOrSVG, updater: UpdateFunc) {
    node.setAttribute('x-oid', String(checkId(id)))
    for (let field of $findAll(node, 'input[type=text][x-field],textarea[x-field]') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>) {
        field.onchange = () => updater(id, field.getAttribute('x-field'), field.value)
    }
    return show(node)
}
