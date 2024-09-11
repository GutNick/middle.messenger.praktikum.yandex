import Handlebars from 'handlebars';
import * as Pages from './pages';

import {SIGN_IN_PAGE_PROPS, SIGN_UP_PAGE_PROPS} from "./const";
import {userData} from "./mockData"

import Button from './components/Button';
import Link from './components/Link';
import Input from './components/Input';
import Sidebar from "./components/Sidebar";
import Avatar from "./components/Avatar";

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Sidebar', Sidebar);
Handlebars.registerPartial('Avatar', Avatar);

enum stateKeys {
  CURRENT_PAGE = "currentPage",
  IS_EDITING_PROFILE = "isEditingProfile",
  IS_CHANGING_PASSWORD = "isChangingPassword",
}

class App {
  state: Record<stateKeys, boolean | string>
  appElement: HTMLElement | null;
  constructor() {
    this.state = {
      currentPage: window.location.pathname,
      isEditingProfile: false,
      isChangingPassword: false,
    }
    this.appElement = document.getElementById('app');
    this.setPageRoute(this.state[stateKeys.CURRENT_PAGE]);
  }

  render() {
    if (this.appElement) {
      let template;
      if (this.state[stateKeys.CURRENT_PAGE] === '/signIn') {
        template = Handlebars.compile(Pages.SignPage);
        this.appElement.innerHTML = template({...SIGN_IN_PAGE_PROPS});
      } else if (this.state[stateKeys.CURRENT_PAGE] === '/signUp') {
        template = Handlebars.compile(Pages.SignPage);
        this.appElement.innerHTML = template({...SIGN_UP_PAGE_PROPS});
      } else if (this.state[stateKeys.CURRENT_PAGE] === '/') {
        template = Handlebars.compile(Pages.ChatPage);
        this.appElement.innerHTML = template({});
      } else if (this.state[stateKeys.CURRENT_PAGE] === '/profile') {
        template = Handlebars.compile(Pages.ProfilePage);
        this.appElement.innerHTML = template({
          isDisabled: !this.state[stateKeys.IS_EDITING_PROFILE],
          isEditingProfile: this.state[stateKeys.IS_EDITING_PROFILE],
          isChangingPassword: this.state[stateKeys.IS_CHANGING_PASSWORD],
          userData
        });
      } else if (this.state[stateKeys.CURRENT_PAGE] === '/404') {
        template = Handlebars.compile(Pages.ErrorPage);
        this.appElement.innerHTML = template({errorCode: '404', errorDescription: 'Не туда попали'});
      } else if (this.state[stateKeys.CURRENT_PAGE] === '/500') {
        template = Handlebars.compile(Pages.ErrorPage);
        this.appElement.innerHTML = template({errorCode: '500', errorDescription: 'Мы уже фиксим'});
      }
      this.attachEventListeners()
    } else {
      throw new Error('Нет родительского блока')
    }
  }

  attachEventListeners() {
    const submitButton = document.getElementById('submit');
    if (this.state[stateKeys.CURRENT_PAGE] === '/signIn' || this.state[stateKeys.CURRENT_PAGE] === '/signUp') {
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.changePage('/');
        })
      }
    }
    if (this.state[stateKeys.CURRENT_PAGE] === '/profile') {
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.state[stateKeys.IS_EDITING_PROFILE] = false
          this.state[stateKeys.IS_CHANGING_PASSWORD] = false
          this.render();
        })
      }
    }
    const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.link');
    links.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        if (target.dataset?.page) {
          this.changePage(target.dataset.page);
        } else if (target.dataset.action) {
          this.handleAction(target.dataset.action)
        }
      });
    });
    const signInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.sign-form__input');
    signInputs.forEach(signInput => {
      signInput.addEventListener('focus', (e: FocusEvent) => {
        const target = e.target as HTMLInputElement;
        const label = target.closest('.sign-form__label');
        if (label) {
          label.classList.add('sign-form__label_active');
        }
      })
      signInput.addEventListener('blur', (e) => {
        const target = e.target as HTMLInputElement;
        const label = target.closest('.sign-form__label');
        if (label) {
          label.classList.toggle('sign-form__label_active', !!target.value);
        }
      })
    })
  }

  changePage(page: string) {
    this.state[stateKeys.CURRENT_PAGE] = page;
    this.setPageRoute(page);
    this.render();
  }

  handleAction(action: string) {
    const params = action.split(" ")
    params.forEach(param => {
      if (param === stateKeys.IS_EDITING_PROFILE || param === stateKeys.IS_CHANGING_PASSWORD) {
        this.state[param] = !this.state[param];
      }
    })
    this.render();
  }

  setPageRoute(path: string | boolean) {
    if (typeof path === 'string') {
      window.history.replaceState(null, "", path);
    }
  }
}

export default App;
