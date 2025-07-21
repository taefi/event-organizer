import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {AutoForm, AutoGrid, AutoGridRef} from "@vaadin/hilla-react-crud";
import {EventCrudService} from "Frontend/generated/endpoints";
import EventModel from "Frontend/generated/com/github/taefi/organizer/event/data/EventModel";
import {
    Button, GridColumn,
    HorizontalLayout,
    Icon,
    MasterDetailLayout,
    SplitLayout,
    VerticalLayout
} from "@vaadin/react-components";
import type Event from "Frontend/generated/com/github/taefi/organizer/event/data/Event";
import {Signal, useSignal} from "@vaadin/hilla-react-signals";
import {ForwardedRef, useRef} from "react";
import {useNavigate} from "react-router";

export const config: ViewConfig = {
    menu: { order: 10, icon: 'vaadin:list' },
    title: 'My Events',
    rolesAllowed: ['ORGANIZER'],
};

export default function OrganizerEventsView() {
    const selectedEvent = useSignal<Event | null>(null);
    const autoGridRef = useRef<AutoGridRef>(null);
    const refreshGrid = () => autoGridRef.current?.refresh();
    const initNewEvent = () => selectedEvent.value = EventModel.createEmptyValue();

    const closeEventDetails = () => {
        selectedEvent.value = null;
        if (autoGridRef.current) {
            autoGridRef.current.grid!.selectedItems = [];
        }
    }
    return (
        <SplitLayout style={{ height: '100%' }}>
            <MasterDetailLayout forceOverlay
                                masterMinSize="450px"
                                detailMinSize="450px"
                                onDetailEscapePress={closeEventDetails}
                                onBackdropClick={closeEventDetails}>
                <MasterDetailLayout.Master>
                    <EventList selectedEvent={selectedEvent}
                               onSelect={(e) => selectedEvent.value = e}
                               autoGridRef={autoGridRef}
                               initNewEvent={initNewEvent}/>
                </MasterDetailLayout.Master>
                <MasterDetailLayout.Detail>
                    {selectedEvent.value ?
                        <EventDetails item={selectedEvent.value}
                                      afterSave={_ => refreshGrid()}
                                      onClose={() => selectedEvent.value = null} />
                    : null}
                </MasterDetailLayout.Detail>
            </MasterDetailLayout>
            <div style={{
                flex: '0 0 auto',
                minWidth: '1.75em',
                backgroundColor: 'var(--lumo-contrast-5pct)',
                display: 'flex',
                textAlign: 'center' }}>
                <span style={{textOrientation: 'sideways', writingMode: 'vertical-lr', fontWeight: 'bold'}}>
                    Select an event to view their details
                </span>
            </div>
        </SplitLayout>
    );
}

interface EventListProps {
    selectedEvent: Signal<Event | null>;
    onSelect(event: Event | null): void;
    autoGridRef: ForwardedRef<AutoGridRef<Event>>;
    initNewEvent?: () => void;
}

function EventList({ selectedEvent, onSelect, autoGridRef, initNewEvent }: EventListProps) {
    const navigate = useNavigate();

    function inviteButtonRenderer({ item }: { item: Event }) {
        return item.public ?
            <Button disabled>Public</Button> :
            <Button theme="primary" onClick={() => navigate(`/invitations/create/${item.id}`)}>
                Invite
            </Button>;
    }

    return (
        <VerticalLayout style={{ height: '100%', border: '1px solid var(--lumo-contrast-20pct)' }}>
            <HorizontalLayout theme="spacing padding" style={{ width: '100%', alignItems: 'center' }}>
                <div style={{padding:'var(--lumo-space-m)', fontWeight:'bold'}}>Select an event to view their details:</div>
                <div slot="end">
                    <Button onClick={initNewEvent} theme="primary" >
                        <Icon icon="vaadin:plus" slot={'prefix'} />
                        Create Event
                    </Button>
                </div>
            </HorizontalLayout>

            <AutoGrid
                style={{ height: '100%', border: '1px solid var(--lumo-contrast-20pct)' }}
                service={EventCrudService}
                model={EventModel}
                selectedItems={selectedEvent.value ? [selectedEvent.value] : []}
                onActiveItemChanged={(e) => {
                    onSelect(e.detail.value ?? null)
                }}
                hiddenColumns={['location', 'capacity', 'organizer', 'key', 'public']}
                ref={autoGridRef}
                customColumns={[
                    <GridColumn key="supplierInfo" renderer={inviteButtonRenderer} width='50px'/>
                ]}
            />
        </VerticalLayout>
    );
}

interface EventDetailProps {
    item: Event | null;
    onClose(): void;
    afterSave: (savedEvent: Event) => void;
}

function EventDetails({ onClose, item, afterSave }: EventDetailProps) {
    const title: String = item?.id ? 'Edit Event' : 'New Event';
    return (
        <VerticalLayout theme="padding" style={{ height: '100%' }}>
            <h2 style={{padding:'var(--lumo-space-m)', fontWeight:'bold'}}>{title}:</h2>
            <AutoForm
                service={EventCrudService}
                model={EventModel}
                item={item}
                hiddenFields={['organizer', 'key']}
                onSubmitSuccess={(submitEvt) => {
                    afterSave(submitEvt.item);
                    onClose();
                }}
            />
            <Button onClick={onClose}>Close</Button>
        </VerticalLayout>
    );
}
