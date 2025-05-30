import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import {
    Avatar,
    Button,
    Card, FormLayout,
    HorizontalLayout, Notification,
    PasswordField,
    PasswordFieldValueChangedEvent, Select,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import {useForm, useFormPart} from "@vaadin/hilla-react-form";
import NewUserModel from 'Frontend/generated/com/github/taefi/organizer/base/services/UserEndpoint/NewUserModel';
import NewUser from "Frontend/generated/com/github/taefi/organizer/base/services/UserEndpoint/NewUser";
import {UserEndpoint} from "Frontend/generated/endpoints";
import {useEffect} from "react";
import CreateUserResponse
    from "Frontend/generated/com/github/taefi/organizer/base/services/UserEndpoint/CreateUserResponse";

export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Sign Up',
    skipLayouts: true,
};

export default function SignupView() {

    const { model, field, submit, clear, value, addValidator } = useForm(NewUserModel, {
        onSubmit: async (newUser: NewUser) => {
            const response = await UserEndpoint.createUser(newUser);
            if (!response.success) {
                Notification.show(response.errorMessage, { position: 'top-end', theme: 'error', duration: 5000 });
            } else {
                Notification.show("Your user has been created successfully!", { position: 'top-end', theme: 'success' });
                setTimeout(() => {
                    clear();
                    Notification.show("You're automatically being redirected to the login page...", { position: 'top-end', theme: 'success', duration: 5000 });
                    setTimeout(() => {
                        document.location.href = '/login?signup-success=true';
                    }, 5000);
                }, 1000)
            }
        }
    });

    useEffect(() => {
        addValidator({
            message: 'Passwords do not match',
            validate: (newUser: NewUser) => {
                if(newUser.password != newUser.confirmPassword) {
                    return [{ property: model.confirmPassword }, { property: model.password } ];
                }
                return [];
            },
        })
    }, []);

    const emailField = useFormPart(model.email);
    useEffect(() => {
        emailField.addValidator({
            message: 'This email address is already in use.',
            validate: async (email: string) => {
                if(!email || email.length < 6) {
                    return [];
                }
                const emailAvailable = await UserEndpoint.isEmailAvailable(email);
                if(!emailAvailable) {
                    return [{ property: model.email }];
                }
                return [];
            },
        })
    }, []);

    return (
        <VerticalLayout theme="spacing padding" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ width: '350px' }}>
                <img src="images/icons8-sign-up-100.png" width="100" slot="header-prefix" alt="icon"/>
                <h1 slot="title">Sign Up</h1>
                <FormLayout theme="spacing padding">
                    <Select label="Sign up as"
                            {...field(model.role)}
                            items={[{ label: 'Attendee in events', value: 'ATTENDEE' }, { label: 'Event Organizer', value: 'ORGANIZER' }]}
                            defaultValue="ATTENDEE"
                            style={{ width: '100%' }}/>
                    <TextField label="Email" {...field(model.email)} style={{ width: '100%' }}/>
                    <TextField label="Name" {...field(model.name)} style={{ width: '100%' }}/>
                    <PasswordField label="Password" {...field(model.password)} style={{ width: '100%' }}/>
                    <PasswordField label="Confirm Password" {...field(model.confirmPassword)} style={{ width: '100%' }}/>
                    <Button theme="primary" onClick={submit}  style={{ width: '100%', marginTop: '10px' }}>Sign Up</Button>
                </FormLayout>
                <HorizontalLayout slot="footer" theme="spacing-xs" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>Already have an account?</span><a href="/login">Sign in</a>
                </HorizontalLayout>
            </Card>
        </VerticalLayout>
    );
}
