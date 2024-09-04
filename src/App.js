import Handlebars from 'handlebars';
import * as Pages from './pages';

import {SIGN_IN_PAGE_PROPS, SIGN_UP_PAGE_PROPS} from "./const.js";

import Button from './components/Button.js';
import Link from './components/Link.js';
import Input from './components/Input.js';

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Input', Input);

class App {
  constructor() {
    this.state = {
      currentPage: window.location.pathname,
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
    }
    this.attachEventListeners()
  }

  attachEventListeners() {
    if (this.state.currentPage === '/signIn' || this.state.currentPage === '/signUp') {
      const submitButton = document.getElementById('submit');
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.changePage('/');
        })
      }
    }
    const links = document.querySelectorAll('.link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.changePage(e.target.dataset.page);
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
    this.setPageRoute(page)
    this.render();
  }

  setPageRoute(path) {
    window.history.replaceState(null, null, path);
  }
}

export default App;