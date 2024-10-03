import Block from "../../utils/Block";
import {Link} from "../Link/Link";

export class Sidebar extends Block {
	constructor(changePage: (page: string) => void) {
		super({
			SidebarLink: new Link({
				href: '#',
				dataPage: '/chats',
				text: '',
				className: 'sidebar__link',
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

	render(): string {
		return '<div class="sidebar">{{{ SidebarLink }}}</div>';
	}

}
