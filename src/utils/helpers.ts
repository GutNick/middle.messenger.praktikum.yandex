import Block from "./Block";
import {Label} from "../components/Label/Label";
import {Input} from "../components/Input/Input";
import validator from "./Validator";

type formData = {name: string, value: string};

export const getFormData = (component: Block): formData | null => {
	if (component instanceof Input && component.element && component.element instanceof HTMLInputElement) {
		return {name: component.element.name, value: component.element.value};
	}
	if (component instanceof Label) {
		return getFormData(component.children[Object.keys(component.children)[0]])
	}
	return null
}
type customValidateRule = {
	rule: string,
	message: string,
}
export const validateForm = (component: Block) => {
	if (component instanceof Input && component.element && component.element instanceof HTMLInputElement) {
		const customValidateRule = component.props?.customValidateRule as customValidateRule;
		const {isValid} = validator.isValid(component.element, customValidateRule?.rule, customValidateRule?.message)
		if (!isValid) {
			return false
		}
	}

	if (component.children && typeof component.children === 'object') {
		for (const key in component.children) {
			if (Object.prototype.hasOwnProperty.call(component.children, key)) {
				const child = component.children[key];
				if (!validateForm(child)) {
					return false;
				}
			}
		}
	}
	return true;
}

export const isEquals = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
	if(Object.keys(obj1).length === Object.keys(obj2).length) {
		return Object.keys(obj1).reduce((acc, rec) => {
			return acc && obj1[rec] === obj2[rec]
		}, true)
	}
	return false
}
