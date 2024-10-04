import Block from "../../utils/Block";
import {Avatar} from "../Avatar/Avatar";

export interface IChatListItemProps {
	id: number
	avatar: string
	name: string
	lastMessage: string
	time: string
	notifications: number,
	onClick?: (e: MouseEvent, block: Block) => void;
	isActive?: boolean
}

export class ChatListItem extends Block {
	constructor(props: IChatListItemProps) {
		super({
			...props,
			Avatar: new Avatar({
				src: props.avatar,
				className: 'chats__item-avatar-wrapper'
			}),
			events: {
				click: (e: MouseEvent) => {
					if (props.onClick) props.onClick(e, this);
				},
			},
		});
	}

	render() {
		return `<li class="chats__item ${this.props.isActive ? 'chats__item_is-active' : ''}">
										{{{ Avatar }}}
										<div class="chats__item-description">
											<p class="chats__name">{{name}}</p>
											<p class="chats__last-message">{{lastMessage}}</p>
										</div>
										<div class="chats__item-info">
											<p class="chats__item-time">{{time}}</p>
											<div class="chats__item-notifications">{{notifications}}</div>
										</div>
								</li>`
	}
}
