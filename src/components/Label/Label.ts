import Block from "../../utils/Block";
import {IInputProps, Input} from "../Input/Input";
import {InputErrorMessage} from "../InputErrorMessage/InputErrorMessage";
import validator from "../../utils/Validator";
import {isEquals} from "../../utils/helpers";

interface ILabelProps {
	className?: string;
	label: string,
	inputProps: IInputProps
	customValidateRule?: {
		rule: string,
		message: string,
	}
}

export class Label extends Block {
	constructor(props: ILabelProps) {
		super({
			...props,
			InputElement: new Input({
				...props.inputProps,
				className: props.className,
				onBlur: (e) => {
					this.isValid()
					if (props.inputProps.onBlur) {
						props.inputProps.onBlur(e)
					}
				},
				customValidateRule: props.customValidateRule,
			}),
			ErrorMessage: new InputErrorMessage({
				className: "validation-error-message",
				isActive: false,
			})
		});
	}

	componentDidMount() {
		this.children.ErrorMessage.hide()
	}

	isValid(): void {
		let elementValidation
		const {customValidateRule} = this.props as unknown as ILabelProps
		if (customValidateRule?.rule && customValidateRule.message) {
			elementValidation = validator.isValid(this.children.InputElement.element, customValidateRule.rule, customValidateRule.message)
		} else {
			elementValidation = validator.isValid(this.children.InputElement.element)
		}
		this.children.ErrorMessage.setProps({text: elementValidation.errorMessage})
		if (!elementValidation.isValid) {
			this.children.ErrorMessage.show()
		} else {
			this.children.ErrorMessage.hide()
		}
	}

	componentDidUpdate(oldProps: Record<string, unknown>, newProps: Record<string, unknown>): boolean {
		if (!isEquals(oldProps, newProps)) {
			this.children.InputElement.setProps({customValidateRule: newProps.customValidateRule})
		}
		return true
	}

	// Возвращаем строку с шаблоном
	render() {
		return '<label class="label {{className}}__label"><span class="label-text {{className}}__label-text">{{label}}</span>{{{InputElement}}}{{{ErrorMessage}}}</label>';
	}
}
