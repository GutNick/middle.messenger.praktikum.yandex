import Block from "../../utils/Block";
import {Link} from "../../components/Link/Link";

export class NavPage extends Block {
	static title = 'Навигация';
	constructor(changePage: (page: string) => void) {
		super({
			title: NavPage.title,
			LoginLink: new Link({
				href: '#',
				dataPage: '/signIn',
				text: 'Страница Авторизации',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						changePage(target.dataset.page);
					}
				}
			}),
			RegisterLink: new Link({
				href: '#',
				dataPage: '/signUp',
				text: 'Страница Регистрации',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						changePage(target.dataset.page);
					}
				}
			}),
			ChatsLink: new Link({
				href: '#',
				dataPage: '/chats',
				text: 'Страница Чатов',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						changePage(target.dataset.page);
					}
				}
			}),
			ProfileLink: new Link({
				href: '#',
				dataPage: '/profile',
				text: 'Страница Профиля',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						changePage(target.dataset.page);
					}
				}
			}),
			NotFoundLink: new Link({
				href: '#',
				dataPage: '/404',
				text: 'Страница 404',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						changePage(target.dataset.page);
					}
				}
			}),
			ServerErrorLink: new Link({
				href: '#',
				dataPage: '/500',
				text: 'Страница 5**',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						changePage(target.dataset.page);
					}
				}
			})
		});
	}

	render() {
		return `
				<section class="page">
        <h1 class="sign-form__title">{{title}}</h1>
    <nav>
        <ul>
            <li>
                {{{ LoginLink }}}
            </li>
            <li>
                {{{ RegisterLink }}}
            </li>
            <li>
                {{{ ChatsLink }}}
            </li>
            <li>
                {{{ ProfileLink }}}
            </li>
            <li>
                {{{ NotFoundLink }}}
            </li>
            <li>
                {{{ ServerErrorLink }}}
            </li>
        </ul>
    </nav>
</section>
		`;
	}
}
