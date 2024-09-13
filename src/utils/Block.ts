import {EventBus} from "./EventBus";

type Props = Record<string, unknown>; // Тип для пропсов, указываем что значения могут быть любыми (unknown)

class Block {
	static EVENTS = {
		INIT: "init",
		FLOW_CDM: "flow:component-did-mount",
		FLOW_CDU: "flow:component-did-update",
		FLOW_RENDER: "flow:render",
	};

	private _element: HTMLElement | null = null;
	private readonly _meta: { tagName: string; props: Props } | null = null;
	private readonly props: Props;
	eventBus: () => EventBus;

	constructor(tagName = "div", props: Props = {}) {
		const eventBus = new EventBus();
		this._meta = {
			tagName,
			props,
		};

		this.props = this._makePropsProxy(props); // Указываем, что props имеют тип Props

		this.eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	// Регистрация событий через eventBus
	private _registerEvents(eventBus: EventBus) {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
	}

	private _createResources() {
		if (this._meta) {
			const {tagName} = this._meta;
			this._element = this._createDocumentElement(tagName);
		}
	}

	init() {
		this._createResources();
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
	}

	private _componentDidMount() {
		this.componentDidMount();
	}

	componentDidMount(oldProps?: Props) {
		console.log(oldProps);
	}

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
		console.log(oldProps, newProps);
		return true;
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
		const block = this.render();
		if (this._element) {
			this._element.innerHTML = block;
		}
	}

	render(): string {
		return "";
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
				target[prop] = value;
				this.eventBus().emit(Block.EVENTS.FLOW_CDU, {...target}, target);
				return true;
			},
			deleteProperty() {
				throw new Error("Нет доступа");
			},
		});
	}

	private _createDocumentElement(tagName: string): HTMLElement {
		return document.createElement(tagName);
	}
}

export default Block
