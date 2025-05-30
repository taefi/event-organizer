import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import { LoginI18n, LoginOverlay, LoginOverlayElement } from '@vaadin/react-components/LoginOverlay.js';
import { useAuth } from 'Frontend/util/auth.js';

export const config: ViewConfig = {
  menu: { exclude: true },
};

const loginI18n: LoginI18n = {
  ...new LoginOverlayElement().i18n,
  header: { title: 'Event Organizer', description: 'Login using test_user@mail.com/user or test_organizer@mail.com/admin or create your own user via Sign up!' },
    form: {
        username: 'Email',
    },
};

export default function LoginView() {
  const { login } = useAuth();
  const loginError = useSignal(false);

  return (
    <LoginOverlay
      opened
      error={loginError.value}
      noForgotPassword
      i18n={loginI18n}
      onLogin={async ({ detail: { username, password } }) => {
        const { defaultUrl, error, redirectUrl } = await login('test_organizer@mail.com', 'admin');

        if (error) {
          loginError.value = true;
        } else {
          const url = redirectUrl ?? defaultUrl ?? '/';
          const path = new URL(url, document.baseURI).pathname;
          document.location = path;
        }
      }}>
        <p slot="footer" className="text-center">
            Don't have an account? <a href="/signup">Sign up</a>
        </p>
    </LoginOverlay>
  );
}
