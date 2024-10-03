import Block from "../../utils/Block";

interface IAvatarProps {
	className?: string;
	src: string;
}

export class Avatar extends Block {
	constructor(props: IAvatarProps) {
		super({...props});
	}

	render(): string {
		return `<div class="avatar {{className}}">
			<img src="{{src}}" class="avatar__image" alt="Аватар">
			</div>`;
	}
}
