import Block from "./Block";
import { render } from "./renderDOM";

interface RouteProps {
	rootQuery: string;
}

class Route {
	private _pathname: string;
	private readonly _blockClass: { new (): Block };
	private _block: Block | null;
	private _props: RouteProps;

	constructor(pathname: string, view: { new (): Block }, props: RouteProps) {
		this._pathname = pathname;
		this._blockClass = view;
		this._block = null;
		this._props = props;
	}

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	leave() {
		if (this._block) {
			this._block.element?.remove()
		}
	}

	match(pathname: string) {
		// return isEqual(pathname, this._pathname);
		return this._pathname === pathname;
	}

	render() {
		if (!this._block) {
			this._block = new this._blockClass();
		}

		render(this._props.rootQuery, this._block);
	}
}

class Router {
	private static __instance: Router;
	private routes: Route[] = [];
	private history: History = window.history;
	private _currentRoute: Route | null = null;
	private readonly _rootQuery: string;

	constructor(rootQuery: string) {
		this._rootQuery = rootQuery;
		if (Router.__instance) {
			return Router.__instance;
		}
		Router.__instance = this;
	}

	use(pathname: string, block: typeof Block): Router {
		const route = new Route(pathname, block, { rootQuery: this._rootQuery });
		this.routes.push(route);
		return this;
	}

	start(): void {
		window.onpopstate = (() => {
			this._onRoute(window.location.pathname);
		});

		this._onRoute(window.location.pathname);
	}

	private _onRoute(pathname: string): void {
		const route = this.getRoute(pathname);
		if (!route) {
			return;
		}

		if (this._currentRoute && this._currentRoute !== route) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		route.render();
	}

	go(pathname: string): void {
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
	}

	back(): void {
		this.history.back();
	}

	forward(): void {
		this.history.forward();
	}

	getRoute(pathname: string): Route | undefined {
		return this.routes.find(route => route.match(pathname));
	}
}
const router = new Router(".app");

export default router;
