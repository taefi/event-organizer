import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import {useNavigate, useParams} from 'react-router';
import { useSignal } from "@vaadin/hilla-react-signals";
import {useEffect} from "react";
import {EventCrudService, InvitationService} from "Frontend/generated/endpoints";
import {
    Button,
    DateTimePicker,
    FormLayout, FormRow, Grid, GridColumn,
    HorizontalLayout,
    TextArea,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import Event from "Frontend/generated/com/github/taefi/organizer/event/data/Event";
import {Subscription} from "@vaadin/hilla-frontend";
import InvitationResult
    from "Frontend/generated/com/github/taefi/organizer/invitation/service/InvitationService/InvitationResult";

export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Send Invitation',
    rolesAllowed: ['ORGANIZER'],
};

export default function CreateInvitationsView() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const emails = useSignal('');

    const event = useSignal<Event>();
    useEffect(() => {
        EventCrudService.get(parseInt(eventId!))
            .then(e => event.value = e);
    }, []);

    const subscription = useSignal<Subscription<InvitationResult>>();

    const processedEmails = useSignal<InvitationResult[]>([]);

    return (
        <VerticalLayout theme="padding">
            <FormLayout autoResponsive expandColumns expandFields>
                <FormRow>
                    <TextField label='Title' value={event.value?.title} readonly></TextField>
                    <TextField label='Description' value={event.value?.description} readonly data-colspan="2"></TextField>
                </FormRow>
                <FormRow>
                    <DateTimePicker label='Start' value={event.value?.start} readonly></DateTimePicker>
                    <DateTimePicker label='End' value={event.value?.end} readonly></DateTimePicker>
                    <TextField label='Capacity' value={event.value?.capacity?.toString()} readonly></TextField>
                </FormRow>
                <FormRow>
                    <TextField label='Location' value={event.value?.location} readonly data-colspan="3"></TextField>
                </FormRow>
                <FormRow>
                    <TextArea label='Emails to invite (separated by commas)'
                              placeholder='Enter email addresses here...'
                              data-colspan="3"
                              value={emails.value}
                              helperText="Please enter email addresses separated by commas."
                              minRows={3} maxRows={5}
                              onValueChanged={(e) => emails.value = e.detail.value} />
                </FormRow>
            </FormLayout>
            <HorizontalLayout theme="spacing">
                <Button theme="primary" disabled={emails.value.length <= 3}
                        onClick={() => {
                            subscription.value = InvitationService.sendInvitations(emails.value, event.value!.id!)
                                .onNext(result => processedEmails.value = [...processedEmails.value, result]);
                        }}>Send Invitation(s)</Button>
                <Button onClick={() => navigate('/events')}>Cancel</Button>
            </HorizontalLayout>
            <Grid items={processedEmails.value}>
                <GridColumn path="email" />
                <GridColumn path="success" />
            </Grid>
        </VerticalLayout>
    );
}