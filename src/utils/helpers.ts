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

type PlainObject<T = unknown> = {
	[k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
	return typeof value === 'object'
		&& value !== null
		&& value.constructor === Object
		&& Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is PlainObject | unknown[] {
	return isPlainObject(value) || isArray(value);
}

export function isEqual(lhs: PlainObject | unknown[], rhs: PlainObject | unknown[]): boolean {
	if (isArray(lhs) && isArray(rhs)) {
		if (lhs.length !== rhs.length) {
			return false;
		}

		for (let i = 0; i < lhs.length; i++) {
			const leftValue = lhs[i];
			const rightValue = rhs[i];

			if (isArrayOrObject(leftValue) && isArrayOrObject(rightValue)) {
				if (!isEqual(leftValue, rightValue)) {
					return false;
				}
			} else if (leftValue !== rightValue) {
				return false;
			}
		}
		return true;
	}

	if (isPlainObject(lhs) && isPlainObject(rhs)) {
		if (Object.keys(lhs).length !== Object.keys(rhs).length) {
			return false;
		}

		for (const [key, value] of Object.entries(lhs)) {
			const rightValue = rhs[key];
			if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
				if (!isEqual(value, rightValue)) {
					return false;
				}
			} else if (value !== rightValue) {
				return false;
			}
		}
		return true;
	}

	return false;
}


export type Indexed<T = unknown> = {
	[key in string]: T;
};

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
	for (const p in rhs) {
		if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
			continue;
		}

		try {
			if (typeof rhs[p] === 'object' && rhs[p] !== null && rhs[p].constructor === Object) {
				rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
			} else {
				lhs[p] = rhs[p];
			}
		} catch(e) {
			console.error(e)
			lhs[p] = rhs[p];
		}
	}

	return lhs;
}

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
	// Проверка, что object является объектом
	if (typeof object !== 'object' || object === null) {
		return object;
	}

	if (typeof path !== 'string') {
		throw new Error('path must be string');
	}

	// Приведение типа value к типу Indexed через явную проверку
	const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
		[key]: acc,
	}), value as Indexed);

	return merge(object as Indexed, result);
}

interface IMessage {
	last_message: {time: string;} | null;
}

export const sortByLastMessage = (arr: IMessage[]): IMessage[] => {
	return arr.sort((a, b) => {
		const timeA = a.last_message ? new Date(a.last_message.time).getTime() : null;
		const timeB = b.last_message ? new Date(b.last_message.time).getTime() : null;

		if (timeA === null && timeB === null) return 0;
		if (timeA === null) return 1;
		if (timeB === null) return -1;

		return timeB - timeA;
	});
}
