import Block from "../../utils/Block";

export interface IModalProps {
	title: string;
	input: Block;
	button: Block;
	isActive?: boolean;
	description?: string;
}

export class Modal extends Block {
	constructor(props: IModalProps) {
		super({
			...props,
			Input: props.input,
			Button: props.button,
			events: {
				click: (e: MouseEvent) => {
					if (e.target === this.element) {
						this.setProps({isActive: false})
					}
				},
			},
		});
	}

	componentDidMount() {
		this.children.Button.setAttributes({disabled: true});
	}

	render() {
		return `<div class="popup ${this.props.isActive ? '' : 'popup_hidden'}">
			<div class="popup__body">
			<p class="popup__title">{{title}}</p>
			{{{ Input }}}
			{{#if this.description}}
			<p>{{description}}</p>
			{{/if}}
			{{{ Button }}}
</div>
		</div>`
	}
}
