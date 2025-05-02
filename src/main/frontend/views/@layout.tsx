import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal } from '@vaadin/hilla-react-signals';
import { AppLayout, Avatar, Button, DrawerToggle, Icon, SideNav, SideNavItem } from '@vaadin/react-components';
import { useAuth } from 'Frontend/util/auth.js';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

const documentTitleSignal = signal('');
effect(() => {
  document.title = documentTitleSignal.value;
});

// Publish for Vaadin to use
(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

export default function MainLayout() {
  const currentTitle = useViewConfig()?.title;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentTitle) {
      documentTitleSignal.value = currentTitle;
    }
  }, [currentTitle]);

  const { state, logout } = useAuth();
  return (
    <AppLayout primarySection="drawer">
      <div slot="drawer" className="flex flex-col justify-between h-full p-m">
        <header className="flex flex-col gap-m">
          <span className="font-semibold text-l">Event Organizer</span>
          <SideNav onNavigate={({ path }) => navigate(path!)} location={location}>
            {createMenuItems().map(({ to, title, icon }) => (
              <SideNavItem path={to} key={to}>
                {icon ? <Icon src={icon} slot="prefix"></Icon> : <></>}
                {title}
              </SideNavItem>
            ))}
          </SideNav>
        </header>
        <footer className="flex flex-col gap-s">
          {state.user?.claims ? (
            <>
              <div className="flex items-center gap-s">
                <Avatar
                  theme="xsmall"
                  img={state.user.claims['picture'] as string | undefined}
                  name={state.user.claims['name'] as string | undefined}
                />
                {state.user.claims['name'] as string | undefined}
              </div>
              <Button
                onClick={async () => {
                  await logout();
                  document.location.reload();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                document.location.assign('/oauth2/authorization/control-center');
              }}
            >
              Sign in
            </Button>
          )}
        </footer>
      </div>

      <DrawerToggle slot="navbar" aria-label="Menu toggle"></DrawerToggle>
      <h1 slot="navbar" className="text-l m-0">
        {documentTitleSignal}
      </h1>

      <Suspense>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}
