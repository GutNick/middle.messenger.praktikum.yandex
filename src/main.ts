import './styles/main.pcss';
import router from "./utils/Router";
import * as Pages from './pages';

document.addEventListener('DOMContentLoaded', () => {
  router
		.use('/', Pages.SignPage)
		.use('/sign-up', Pages.RegisterPage)
		.use('/settings', Pages.ProfilePage)
		.use('/messenger', Pages.ChatPage)
		.use('/settings', Pages.ProfilePage)
		.start()
});
