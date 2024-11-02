import {EventBus} from "./EventBus";
import {Indexed, set} from "./helpers";

export enum StoreEvents {
	Updated = "updated",
}

class Store extends EventBus {
	private state: Indexed = {};

	public getState(): Indexed {
		return this.state;
	}

	public set(path: string, value: unknown) {
		set(this.state, path, value);
		this.emit(StoreEvents.Updated);
	}
}

const store = new Store();
export default store;
