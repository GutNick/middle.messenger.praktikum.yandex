import {v4 as makeUUID} from 'uuid';
import Handlebars from "handlebars";

import {EventBus} from "./EventBus";

type EventsMap = Partial<Record<keyof HTMLElementEventMap, EventListener>>;

type Props = {
	events?: EventsMap;
	[key: string]: unknown;
	settings?: Record<string, unknown>;
	attr?: Record<string, string | boolean>;
};

type Children = {
	[key: string]: Block;
};

class Block {
	static EVENTS = {
		INIT: "init",
		FLOW_CDM: "flow:component-did-mount",
		FLOW_CDU: "flow:component-did-update",
		FLOW_RENDER: "flow:render",
	};

	private _element: HTMLElement | null = null;
	readonly props: Props;
	children: Children;
	eventBus: () => EventBus;
	private readonly _id = null;
	protected lists: Record<string, unknown[]>;

	constructor(propsAndChildren: Record<string, unknown> = {}) {
		const { children, props, lists } = this._getChildren(propsAndChildren);

		this.children = children;
		this.lists = lists;
		const eventBus = new EventBus();

		this._id = makeUUID();

		this.props = this._makePropsProxy({...props, __id: props.settings?.withInternalID ? this._id : null});

		this.eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	private _addEvents() {
		const { events = {} } = this.props;

		(Object.keys(events) as Array<keyof HTMLElementEventMap>).forEach(eventName => {
			const eventHandler = events[eventName];
			if (this._element && eventHandler) {
				this._element.addEventListener(eventName, eventHandler);
			}
		});
	}

	private _removeEvents() {
		const { events = {} } = this.props;

		(Object.keys(events) as Array<keyof HTMLElementEventMap>).forEach(eventName => {
			const eventHandler = events[eventName];

			if (this._element && eventHandler) {
				this._element.removeEventListener(eventName, eventHandler);
			}
		});
	}

	private _registerEvents(eventBus: EventBus) {
		eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
	}

	private _init() {
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
	}

	private _componentDidMount() {
		this.componentDidMount();

		Object.values(this.children).forEach(child => {
			child.dispatchComponentDidMount();
		});
	}

	componentDidMount() {}

	dispatchComponentDidMount() {
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	private _componentDidUpdate(oldProps: Props = {}, newProps: Props = {}) {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (!response) {
			return;
		}
		this._render();
	}

	componentDidUpdate(oldProps: Props, newProps: Props): boolean {
		console.debug(oldProps, newProps);
		return true;
	}

	private _getChildren(propsAndChildren: Record<string, unknown>): { children: Children, props: Props, lists: Record<string, unknown[]> } {
		const children: Children = {};
		const props: Props = {};
		const lists: Record<string, unknown[]> = {};

		Object.entries(propsAndChildren).forEach(([key, value]) => {
			if (value instanceof Block) {
				children[key] = value;
			} else if (Array.isArray(value)) {
				lists[key] = value;
			} else {
				props[key] = value;
			}
		});

		return { children, props, lists };
	}

	protected addAttributes(): void {
		const { attr = {} } = this.props;

		Object.entries(attr).forEach(([key, value]) => {
			if (typeof value === 'string') {
				this._element?.setAttribute(key, value);
			} else {
				if (value) {
					this._element?.setAttribute(key, '');
				} else {
					this._element?.removeAttribute(key);
				}
			}
		});
	}

	setAttributes(attr: Record<string, string | boolean>): void {
		Object.entries(attr).forEach(([key, value]) => {
			if (typeof value === 'string') {
				this._element?.setAttribute(key, value);
			} else {
				if (value) {
					this._element?.setAttribute(key, '');
				} else {
					this._element?.removeAttribute(key);
				}
			}
		});
	}

	setProps = (nextProps: Props) => {
		if (!nextProps) {
			return;
		}
		Object.assign(this.props, nextProps);
	};

	get element(): HTMLElement | null {
		return this._element;
	}

	private _render() {
		this._removeEvents();
		const propsAndStubs = { ...this.props };
		const _tmpId = makeUUID();
		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
		});
		Object.entries(this.lists).forEach(([key]) => {
			propsAndStubs[key] = `<div data-id="__l_${_tmpId}"></div>`;
		});
		const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
		fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);
		Object.values(this.children).forEach(child => {
			const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
			if (stub) {
				stub.replaceWith(child.getContent());
			}
		});
		Object.entries(this.lists).forEach(([, child]) => {
			const listCont = this._createDocumentElement('template') as HTMLTemplateElement;
			child.forEach(item => {
				if (item instanceof Block) {
					listCont.content.append(item.getContent());
				} else {
					listCont.content.append(`${item}`);
				}
			});
			const stub = fragment.content.querySelector(`[data-id="__l_${_tmpId}"]`);
			if (stub) {
				stub.replaceWith(listCont.content);
			}
		});

		const newElement = fragment.content.firstElementChild as HTMLElement;
		if (this._element && newElement) {
			this._element.replaceWith(newElement);
		}
		this._element = newElement;
		if (this.props.__id) {
			this._element.setAttribute('data-id', <string>this.props.__id);
		}
		this._addEvents();
		this.addAttributes();
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	protected render(): string {
		return '';
	}

	getContent(): HTMLElement {
		if (!this.element) {
			throw new Error("Node Element is missing");
		}
		return this.element;
	}

	private _makePropsProxy(props: Props): Props {
		return new Proxy(props, {
			get: (target: Props, prop: string) => {
				const value = target[prop];
				return typeof value === "function" ? value.bind(target) : value;
			},
			set: (target: Props, prop: string, value: unknown) => {
				const oldTarget = { ...target }
				target[prop] = value;
				this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
				return true;
			},
			deleteProperty() {
				throw new Error("Нет доступа");
			},
		});
	}

	private _createDocumentElement(tagName: string): HTMLElement {
		const element = document.createElement(tagName);
		if (this._id) {
			element.setAttribute('data-id', this._id);
		}
		return element;
	}

	public show(): void {
		const content = this.getContent();
		if (content) {
			content.style.display = 'block';
		}
	}

	public hide(): void {
		const content = this.getContent();
		if (content) {
			content.style.display = 'none';
		}
	}
}

export default Block
