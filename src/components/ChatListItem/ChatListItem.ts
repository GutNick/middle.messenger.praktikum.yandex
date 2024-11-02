import Block from "../../utils/Block";
import {Avatar} from "../Avatar/Avatar";

export interface IChatListItemProps {
	id: number
	avatar: string
	title: string
	last_message: {content: string}
	time: string
	unread_count: number,
	onClick?: (e: MouseEvent, block: Block) => void;
	isActive?: boolean
}
export class ChatListItem extends Block {
	constructor(props: IChatListItemProps) {
		super({
			...props,
			Avatar: new Avatar({
				src: props.avatar ? `https://ya-praktikum.tech/api/v2/resources${props.avatar}` : "/images/avatar.png",
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
											<p class="chats__name">{{title}}</p>
											<p class="chats__last-message">{{last_message.content}}</p>
										</div>
										<div class="chats__item-info">
											<p class="chats__item-time">{{time}}</p>
											{{#if this.unread_count}}
											<div class="chats__item-notifications">{{unread_count}}</div>
											{{/if}}
										</div>
								</li>`
	}
}
