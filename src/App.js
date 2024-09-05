import Handlebars from 'handlebars';
import * as Pages from './pages';

import {SIGN_IN_PAGE_PROPS, SIGN_UP_PAGE_PROPS} from "./const.js";
import {userData} from "./mockData.js"

import Button from './components/Button.js';
import Link from './components/Link.js';
import Input from './components/Input.js';
import Sidebar from "./components/Sidebar.js";
import Avatar from "./components/Avatar.js";

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Sidebar', Sidebar);
Handlebars.registerPartial('Avatar', Avatar);

class App {
  constructor() {
    this.state = {
      currentPage: window.location.pathname,
      isEditingProfile: false,
      isChangingPassword: false,
    }
    this.appElement = document.getElementById('app');
    this.setPageRoute(this.state.currentPage);
  }

  render() {
    let template;
    if (this.state.currentPage === '/signIn') {
      template = Handlebars.compile(Pages.SignPage);
      this.appElement.innerHTML = template({...SIGN_IN_PAGE_PROPS});
    } else if (this.state.currentPage === '/signUp') {
      template = Handlebars.compile(Pages.SignPage);
      this.appElement.innerHTML = template({...SIGN_UP_PAGE_PROPS});
    } else if (this.state.currentPage === '/') {
      template = Handlebars.compile(Pages.ChatPage);
      this.appElement.innerHTML = template({});
    } else if (this.state.currentPage === '/profile') {
      template = Handlebars.compile(Pages.ProfilePage);
      this.appElement.innerHTML = template({
        isDisabled: !this.state.isEditingProfile,
        isEditingProfile: this.state.isEditingProfile,
        isChangingPassword: this.state.isChangingPassword,
        userData
      });
    } else if (this.state.currentPage === '/404') {
      template = Handlebars.compile(Pages.ErrorPage);
      this.appElement.innerHTML = template({errorCode: '404', errorDescription: 'Не туда попали'});
    } else if (this.state.currentPage === '/500') {
      template = Handlebars.compile(Pages.ErrorPage);
      this.appElement.innerHTML = template({errorCode: '500', errorDescription: 'Мы уже фиксим'});
    }
    this.attachEventListeners()
  }

  attachEventListeners() {
    const submitButton = document.getElementById('submit');
    if (this.state.currentPage === '/signIn' || this.state.currentPage === '/signUp') {
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.changePage('/');
        })
      }
    }
    if (this.state.currentPage === '/profile') {
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.state.isEditingProfile = false
          this.state.isChangingPassword = false
          this.render();
        })
      }
    }
    const links = document.querySelectorAll('.link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.dataset.page) {
          this.changePage(e.target.dataset.page);
        } else if (e.target.dataset.action) {
          this.handleAction(e.target.dataset.action)
        }
      });
    });
    const signInputs = document.querySelectorAll('.sign-form__input');
    signInputs.forEach(signInput => {
      signInput.addEventListener('focus', (e) => {
        const label = e.target.closest('.sign-form__label');
        label.classList.add('sign-form__label_active');
      })
      signInput.addEventListener('blur', (e) => {
        const label = e.target.closest('.sign-form__label');
        label.classList.toggle('sign-form__label_active', e.target.value);
      })
    })
  }

  changePage(page) {
    this.state.currentPage = page;
    this.setPageRoute(page);
    this.render();
  }

  handleAction(action) {
    const params = action.split(" ")
    params.forEach(param => {
      this.state[param] = !this.state[param];
    })
    this.render();
  }

  setPageRoute(path) {
    window.history.replaceState(null, null, path);
  }
}

export default App;
