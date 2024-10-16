import Block from "../../utils/Block";
import {Link} from "../Link/Link";
import router from "../../utils/Router";

export class Sidebar extends Block {
	constructor() {
		super({
			SidebarLink: new Link({
				href: '#',
				dataPage: '/messenger',
				text: '',
				className: 'sidebar__link',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						router.go(target.dataset.page);
					}
				}
			})
		});

	}

	render(): string {
		return '<div class="sidebar">{{{ SidebarLink }}}</div>';
	}

}
