import Block from "../../utils/Block";

export interface IInputProps {
	id?: string;
	className?: string;
	onBlur?: (e: Event) => void;
	onChange?: (e: InputEvent) => void;
	onFocus?: (e: FocusEvent) => void;
	type?: "text" | "tel" | "email" | "url" | "password" | "search" | 'file';
	placeholder?: string;
	value?: string;
	name?: string;
	readonly?: boolean;
	validateRule?: string;
	withInternalID?: boolean,
	customValidateRule?: {
		rule: string,
		message: string,
	}
	attr?: Record<string, string | boolean>;
}

export class Input extends Block {
	constructor(props: IInputProps) {
		super({
			...props,
			settings: {withInternalID: props.withInternalID},
			events: {
				blur: (e: FocusEvent) => props.onBlur && props.onBlur(e),
				focus: (e: FocusEvent) => props.onFocus && props.onFocus(e),
				change: (e: InputEvent) => props.onChange && props.onChange(e),
			},
		});
	}

	// Возвращаем строку с шаблоном
	render() {
		return '<input id="{{id}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" class="input {{className}}__input" name="{{name}}" data-validate-rule="{{validateRule}}" >';
	}
}
