import * as Pages from './pages';

// import {SIGN_IN_PAGE_PROPS, SIGN_UP_PAGE_PROPS} from "./const";
import {userData} from "./mockData"


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
			if (this.state[stateKeys.CURRENT_PAGE] === '/') {
				const navigatePage = new Pages.NavPage(this.changePage.bind(this))
				this.appElement.replaceChildren(navigatePage.getContent());
			} else if (this.state[stateKeys.CURRENT_PAGE] === '/signIn') {
				const signPage = new Pages.SignPage(this.changePage.bind(this));
				this.appElement.replaceChildren(signPage.getContent());
			} else if (this.state[stateKeys.CURRENT_PAGE] === '/signUp') {
				const registerPage = new Pages.RegisterPage(this.changePage.bind(this))
				this.appElement.replaceChildren(registerPage.getContent());
			} else if (this.state[stateKeys.CURRENT_PAGE] === '/profile') {
				const profilePage = new Pages.ProfilePage(this.changePage.bind(this), userData)
				this.appElement.replaceChildren(profilePage.getContent());
			} else if (this.state[stateKeys.CURRENT_PAGE] === '/chats') {
				const chatPage = new Pages.ChatPage(this.changePage.bind(this))
				this.appElement.replaceChildren(chatPage.getContent());
			} else if (this.state[stateKeys.CURRENT_PAGE] === '/404') {
				const errorPage = new Pages.ErrorPage(this.changePage.bind(this), '404', 'Не туда попали')
				this.appElement.replaceChildren(errorPage.getContent());
			} else if (this.state[stateKeys.CURRENT_PAGE] === '/500') {
				const errorPage = new Pages.ErrorPage(this.changePage.bind(this), '500', 'Мы уже фиксим')
				this.appElement.replaceChildren(errorPage.getContent());
			}
		}
	}

	changePage(page: string) {
		this.state[stateKeys.CURRENT_PAGE] = page;
		this.setPageRoute(page);
		this.render();
	}

	setPageRoute(path: string | boolean) {
		if (typeof path === 'string') {
			window.history.replaceState(null, "", path);
		}
	}
}

export default App;
