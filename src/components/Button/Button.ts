import Block from "../../utils/Block";

interface IButtonProps {
	className?: string;
	child: string | HTMLElement | Block;
	onClick?: (e: MouseEvent) => void;
	type?: "button" | "submit";
	id?: string;
	attr?: Record<string, unknown>
}

export class Button extends Block {
	constructor(props: IButtonProps) {
		super({
			...props,
			events: {
				click: (e: MouseEvent) => props.onClick && props.onClick(e),
			},
		});
	}

	// Возвращаем строку с шаблоном
	render() {
		return '<button id="{{ id }}" class="button {{ className }}" type="{{ type }}">{{{child}}}</button>';
	}
}
