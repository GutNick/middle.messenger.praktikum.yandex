import Block from "../../utils/Block";
import {Button} from "../Button/Button";

interface IChatConfigPopupProps {
	addUser: () => void;
	removeUser: () => void;
	removeChat: () => void;
}

export class ChatConfigPopup extends Block {
	constructor(props: IChatConfigPopupProps) {
		super({
			AddUserButton: new Button({
				child: 'Добавить пользователя',
				className: 'chat__config-popup-button chat__config-popup-button_add-user',
				onClick: (e: MouseEvent) => {
					e.preventDefault()
					props.addUser()
					this.hide()
				},
			}),
			RemoveUserButton: new Button({
				child: 'Удалить пользователя',
				className: 'chat__config-popup-button chat__config-popup-button_remove-user',
				onClick: (e: MouseEvent) => {
					e.preventDefault()
					props.removeUser()
					this.hide()
				},
			}),
			RemoveChatButton: new Button({
				child: 'Удалить чат',
				className: 'chat__config-popup-button chat__config-popup-button_remove-user',
				onClick: (e: MouseEvent) => {
					e.preventDefault()
					props.removeChat()
					this.hide()
				},
			})
		});
	}

	componentDidMount() {
		super.componentDidMount();
		this.hide()
	}

	render(): string {
		return `<div class="chat__config-popup">
			{{{ AddUserButton }}}
			{{{ RemoveUserButton }}}
			{{{ RemoveChatButton }}}
			</div>`;
	}
}
