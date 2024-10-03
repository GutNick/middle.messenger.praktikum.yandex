import Block from "../../utils/Block";

interface ILinkProps {
	href: string;
	dataPage?: string;
	dataAction?: string;
	text: string;
	className?: string;
	onClick?: (e: MouseEvent) => void;
}

export class Link extends Block {
	constructor(props: ILinkProps) {
		super({
			...props,
			events: {
				click: (e: MouseEvent) => props.onClick && props.onClick(e),
			},
		});
	}

	// Возвращаем строку с шаблоном
	render() {
		return '<a href="{{href}}" class="link {{className}}" data-page="{{dataPage}}" data-action="{{dataAction}}">{{text}}</a>';
	}
}
