import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';


export const config: ViewConfig = {
  menu: { order: 20, icon: 'vaadin:pie-bar-chart' },
  title: 'Dashboard',
  rolesAllowed: ['ORGANIZER'],
};

export default function DashboardView() {
  const name = useSignal('');

  return (
    <>
      <section className="flex p-m gap-m items-end">
        Hi
      </section>
    </>
  );
}
