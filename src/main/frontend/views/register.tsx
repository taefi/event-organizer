import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';


export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Dashboard',
    loginRequired: true,
};

export default function RegisterView() {
    const name = useSignal('');

    return (
        <>
            <section className="flex p-m gap-m items-end">
                Hi
            </section>
        </>
    );
}
