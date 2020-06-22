class Model {
  constructor() {
    // state of the model, an array of navigation links that load views
    this.viewLinks = [
      { id: 0, linkName: 'Dashboard', linkHTML: '#dashboard', active:true},
      { id: 1, linkName: 'Add New Issue', linkHTML: '#addIssue', active:false},
      { id: 2, linkName: 'Search', linkHTML: '#search', active:false}
    ];
    this.viewData = [
      { id: 0, viewName: 'Dashboard', content: [
        {id: 0, displayData: 'This is Some Dashboard Content.'}
      ]}
    ];

  }

  getActiveView(viewLinks) {
    var _id;
    viewLinks.forEach(getLinks);
    function getLinks(link) {
      if(link.active === true) {
        _id = link.id;
      }
    }
    return _id;
  }

  setActiveView(viewLinks, viewId) {
    viewLinks.forEach(getLinks);
    function getLinks(link) {
      link.active = false;
    }
    viewLinks[viewId].active = true;
  }

}

class View {
  constructor() {
    this.app = this.getElement('#app');
    this.nav = this.createElement('nav');
    this.viewList = this.createElement('ul', 'viewList');
    this.nav.append(this.viewList);
    this.actions = this.createElement('div', 'col-3');
    this.actionsTitle = this.createElement('h1');
    this.actionsTitle.append('Actions');
    this.actionList = this.createElement('ul', 'actionList');
    this.actions.append(this.actionsTitle);
    this.actions.append(this.actionList);
    this.content = this.createElement('div', 'col-9');
    this.contentList = this.createElement('ul', 'contentList');
    this.content.append(this.contentList);
    this.app.append(this.nav, this.actions, this.content);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if(className) element.classList.add(className);

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  displayViewLinks(viewLinks, viewList, createElement) {
    viewLinks.forEach(getLinks);
    function getLinks(link) {
      const li = createElement('li');
      li.id = link.id;
      const a = createElement('a');
      a.href = link.linkHTML;
      a.append(link.linkName);
      li.append(a);
      viewList.append(li);
    }
  }
  addContent(data, view) {
    data.forEach(grabData);
    function grabData(item) {
      const li = view.createElement('li');
      li.append(item.displayData);
      view.contentList.append(li);
    }
  }

  getData(id, viewData) {
    return viewData[id].content;
  }

  clearContent(contentList) {
    contentList.innerHTML = '';
  }

  displayView(view, model) {
    view.clearContent(view.contentList);

    view.addContent(view.getData(model.getActiveView(model.viewLinks), model.viewData), view);
  }


}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.displayViewLinks(this.model.viewLinks, this.view.viewList, this.view.createElement);
    this.view.displayView(this.view, this.model);

  }
}

const app = new Controller(new Model(), new View());
