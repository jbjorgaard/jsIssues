class Model {
  constructor() {
    // starting view data
    this.viewData = [
      {
        id: 0, name: 'Dashboard', link: '#dashboard', active: true, content: [
          'This is some dashboard content', 'This is some more dashboard content'
        ]
      },
      {
        id: 1, name: 'Add New Issue', link: '#addNewIssue', active: false, content: [
          'This is the New Issue content', 'This is more New Issue content'
        ]
      },
      {
        id: 2, name: 'Search Issues', link: '#searchIssues', active: false, content: [
          'This is our Search content', 'This is more Search content'
        ]
      }
    ];

  }
  // Find which view is active and return an id
  getActiveView(viewData) {
    var _id;
    for (var item of viewData) {
      if(item.active === true) {
        _id = item.id;
      }
    }

    return _id;
  }
  // set all views to inactive and then set chosen view to active
  setActiveView(viewData, id) {
    for (var item of viewData) {
      item.active = false;
    }

    viewData[id].active = true;
  }
}

class View {
  constructor() {
    // Create basic page structure
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
  // method to create new page elements
  createElement(tag, className) {
    const element = document.createElement(tag);
    if(className) element.classList.add(className);

    return element;
  }
  // method to retrieve existing page elements
  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }
  // populate nav menu with existing views
  displayViewLinks(model, view) {
    for (var item of model.viewData) {
      const li = view.createElement('li');
      li.id = item.id;
      const a = view.createElement('a');
      a.href = item.link;
      a.append(item.name);
      li.append(a);
      view.viewList.append(li);
    }
  }
  // add new content to page content
  addContent(viewDataContent, view) {
    for (var item of viewDataContent) {
      const li = view.createElement('li');
      li.append(item);
      view.contentList.append(li);
    }
  }
  // returns an array of content from a view
  getData(id, viewData) {
    return viewData[id].content;
  }
  // clears existing page content
  clearContent(contentList) {
    contentList.innerHTML = '';
  }
  // calls clearContent and addContent methods
  displayView(model, view) {
    view.clearContent(view.contentList);

    view.addContent(view.getData(model.getActiveView(model.viewData), model.viewData), view);
  }


}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  // seeds initial startup data and populates page
  startup (model, view) {
    this.view.displayViewLinks(this.model, this.view);
    this.view.displayView(this.model, this.view);
  }
}

const app = new Controller(new Model(), new View());
app.startup(app.model, app.view);
