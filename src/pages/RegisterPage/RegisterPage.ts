import Block from "../../utils/Block";
import {Label} from "../../components/Label/Label";
import {getFormData, validateForm} from "../../utils/helpers";
import {Button} from "../../components/Button/Button";
import {Link} from "../../components/Link/Link";
import router from "../../utils/Router";
import authController from "../../controllers/AuthController";
import {ISignUpData} from "../../api/AuthApi";
import {connect} from "../../utils/HOC";
import store from "../../utils/Store";

class RegisterPage extends Block {
	static title = 'Регистрация';
	constructor() {
		super({
			title: RegisterPage.title,
			EmailLabel: new Label({
				label: "Почта",
				className: 'sign-form',
				inputProps: {
					id: 'email',
					type: "email",
					name: 'email',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "email"
				}
			}),
			LoginLabel: new Label({
				label: "Логин",
				className: 'sign-form',
				inputProps: {
					id: 'login',
					type: "text",
					name: 'login',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "login"
				}
			}),
			NameLabel: new Label({
				label: "Имя",
				className: 'sign-form',
				inputProps: {
					id: 'first_name',
					type: "text",
					name: 'first_name',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "name"
				}
			}),
			SecondNameLabel: new Label({
				label: "Фамилия",
				className: 'sign-form',
				inputProps: {
					id: 'second_name',
					type: "text",
					name: 'second_name',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "name"
				}
			}),
			PhoneLabel: new Label({
				label: "Телефон",
				className: 'sign-form',
				inputProps: {
					id: 'phone',
					type: "tel",
					name: 'phone',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.checkFormValidity()
					},
					validateRule: "phone"
				}
			}),
			PasswordLabel: new Label({
				label: 'Пароль',
				className: 'sign-form',
				inputProps: {
					id: 'password',
					type: 'password',
					name: 'password',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
						this.setCheckPasswordProps(target.value)
						this.checkFormValidity()
					},
					validateRule: "password"
				}
			}),
			PasswordCheckLabel: new Label({
				label: 'Пароль (ещё раз)',
				className: 'sign-form',
				customValidateRule: {
					rule: '^.+$',
					message: 'Не должно быть пустым',
				},
				inputProps: {
					id: 'password_check',
					type: 'password',
					onFocus: (e: FocusEvent) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.add('sign-form__label_active');
						}
					},
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						const label = target.closest('.sign-form__label');
						if (label) {
							label.classList.toggle('sign-form__label_active', !!target.value);
						}
					}
				},
			}),
			SubmitButton: new Button({
				type: 'submit',
				id: 'submit',
				child: 'Зарегистрироваться',
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
						authController
							.signUp(data as unknown as ISignUpData)
							.then(() => {
								router.go('/messenger')
							})
					}
				}
			}),
			LoginLink: new Link({
				href: '#',
				dataPage: '/',
				text: 'Войти',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						router.go(target.dataset.page)
					}
				}
			})
		});

		this.checkUserIsAuthenticated()
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

	setCheckPasswordProps(value: string) {
		this.children.PasswordCheckLabel.setProps({customValidateRule: {rule: value, message: 'Пароли не совпадают'}})
		this.children.PasswordCheckLabel.children.InputElement.element?.dispatchEvent(new Event("blur"));
	}

	async checkUserIsAuthenticated() {
		const res = await authController.getUser()
		if (res?.status === 200) {
			const userData = JSON.parse(res.responseText);
			store.set('user', userData);
			router.go('/messenger')
		}
	}

	render() {
		return `
				<section class="page">
    			<div class="sign-form">
        		<h1 class="sign-form__title">{{title}}</h1>
						<form class="sign-form__form">
								{{{ EmailLabel }}}
								{{{ LoginLabel }}}
								{{{ NameLabel }}}
								{{{ SecondNameLabel }}}
								{{{ PhoneLabel }}}
								{{{ PasswordLabel }}}
								{{{ PasswordCheckLabel }}}
								<div class="sign-form__actions">
										{{{ SubmitButton }}}
										{{{ LoginLink }}}
								</div>
						</form>
					</div>
				</section>
		`;
	}
}
export default connect(() => ({}))(RegisterPage);
