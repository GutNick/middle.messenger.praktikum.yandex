import Block from "../../utils/Block";
import {Link} from "../../components/Link/Link";

export class ErrorPage extends Block {
	constructor(changePage: (page: string) => void, errorCode: string, errorDescription: string) {
		super({
			errorCode,
			errorDescription,
			BackLink: new Link({
				href: '#',
				text: 'Назад к чатам',
				dataPage: '/chats',
				className: 'error-message__link',
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
		return `<div class="page">
    <div class="error-message">
        <h1 class="error-message__title">{{errorCode}}</h1>
        <p class="error-message__description">{{errorDescription}}</p>
        {{{BackLink}}}
    </div>
</div>`
	}
}
