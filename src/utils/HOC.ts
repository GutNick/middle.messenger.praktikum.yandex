import store, {StoreEvents} from './Store';
import {Indexed, isEqual} from "./helpers";
import Block, {Props} from "./Block";

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
	return function(Component: typeof Block) {
		return class extends Component {
			constructor(props: Props) {
				let state = mapStateToProps(store.getState());

				super({...props, ...state});

				store.on(StoreEvents.Updated, () => {
					const newState = mapStateToProps(store.getState());
					if (!isEqual(state, newState)) {
						this.setProps({...newState});
					}

					state = newState;
				});
			}
		}
	}
}
