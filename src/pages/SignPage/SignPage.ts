import Block from "../../utils/Block";
import {Label} from "../../components/Label/Label";
import {Button} from "../../components/Button/Button";
import {getFormData, validateForm} from "../../utils/helpers";
import {Link} from "../../components/Link/Link";
import router from "../../utils/Router";

export class SignPage extends Block {
	static title = 'Вход';
	constructor() {
		super({
			title: SignPage.title,
			LoginLabel: new Label({
				label: "Логин",
				className: 'sign-form',
				inputProps: {
					id: 'login',
					type: "text",
					name: 'login',
					onFocus: () => {
						const label = this.children.LoginLabel.element;
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = this.children.LoginLabel.element;
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "login"
				}
			}),
			PasswordLabel: new Label({
				label: 'Пароль',
				className: 'sign-form',
				inputProps: {
					id: 'password',
					type: 'password',
					name: 'password',
					onFocus: () => {
						const label = this.children.PasswordLabel.element;
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = this.children.PasswordLabel.element;
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "password"
				}
			}),
			SubmitButton: new Button({
				type: 'submit',
				id: 'submit',
				child: 'Авторизоваться',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const data: Record<string, string> = {}
					for (const children in this.children) {
						const inputData = getFormData(this.children[children]);
						if (inputData) {
							data[inputData.name] = inputData.value;
						}
					}
					const isFormValid = this.checkFormValidity(true)
					if (isFormValid) {
						console.log(data)
						router.go('/chats')
					}
				}
			}),
			RegisterLink: new Link({
				href: '#',
				dataPage: '/sign-up',
				text: 'Нет аккаунта?',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						router.go(target.dataset.page)
					}
				}
			})
		});
	}

	componentDidMount() {
		this.children.SubmitButton.setAttributes({disabled: true});
	}

	checkFormValidity(checkAllForm?: boolean): boolean {
		if (checkAllForm) {
			for (const key in this.children) {
					if (this.children[key] instanceof Label) {
						this.children[key].isValid()
					}
				}
		}
		const isFormValid = validateForm(this);
		this.children.SubmitButton.setAttributes({disabled: !isFormValid});
		return isFormValid
	}

	render() {
		return `
				<section class="page">
    			<div class="sign-form">
        		<h1 class="sign-form__title">{{title}}</h1>
						<form class="sign-form__form">
								{{{ LoginLabel }}}
								{{{ PasswordLabel }}}
								<div class="sign-form__actions">
										{{{ SubmitButton }}}
										{{{ RegisterLink }}}
								</div>
						</form>
					</div>
				</section>
		`;
	}
}
