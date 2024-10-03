import Block from "../../utils/Block";
interface IInputErrorMessageProps {
	text?: string;
	isActive?: boolean;
	className?: string;
}
export class InputErrorMessage extends Block {
	constructor(props: IInputErrorMessageProps) {
		super({...props});
	}

	render() {
		return '<p class="{{className}}">{{text}}</p>';
	}
}
