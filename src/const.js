export const SIGN_IN_PAGE_PROPS = {
  title: 'Вход',
  inputs: [
    {
      label: 'Логин',
      id: 'login',
      type: 'text',
      placeholder: '',
      value: '',
      name: 'login',
    },
    {
      label: 'Пароль',
      id: 'password',
      type: 'password',
      placeholder: '',
      value: '',
      name: 'password',
    }
  ],
  submitButton: {
    id: 'submit',
    text: 'Авторизоваться'
  },
  link: {
    href: '#',
    dataPage: '/signUp',
    text: 'Нет аккаунта?'
  }
}

export const SIGN_UP_PAGE_PROPS = {
  title: 'Регистрация',
  inputs: [
    {
      label: 'Почта',
      id: 'email',
      type: 'email',
      placeholder: '',
      value: '',
      name: 'email',
    },
    {
      label: 'Логин',
      id: 'login',
      type: 'text',
      placeholder: '',
      value: '',
      name: 'login',
    },
    {
      label: 'Имя',
      id: 'first_name',
      type: 'text',
      placeholder: '',
      value: '',
      name: 'first_name',
    },
    {
      label: 'Фамилия',
      id: 'second_name',
      type: 'text',
      placeholder: '',
      value: '',
      name: 'second_name',
    },
    {
      label: 'Телефон',
      id: 'phone',
      type: 'tel',
      placeholder: '',
      value: '',
      name: 'phone',
    },
    {
      label: 'Пароль',
      id: 'password',
      type: 'text',
      placeholder: '',
      value: '',
      name: 'password',
    },
    {
      label: 'Пароль (ещё раз)',
      id: 'password_check',
      type: 'text',
      placeholder: '',
      value: '',
      name: '',
    }
  ],
  submitButton: {
    id: 'submit',
    text: 'Зарегистрироваться'
  },
  link: {
    href: '#',
    dataPage: '/signIn',
    text: 'Войти'
  }
}