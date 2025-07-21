create table invitations
(
    id             bigint      not null,
    version        int         not null,
    receiver_email varchar(100) not null,
    created_by_id  bigint      not null,
    event_id       bigint      not null,
    invitation_key UUID not null,
    CONSTRAINT pk_invitations PRIMARY KEY (id),
    CONSTRAINT uq_invitations_key UNIQUE (invitation_key),
    CONSTRAINT uq_invitations_receiver_event UNIQUE (receiver_email, event_id)
);

alter table invitations
    add constraint fk_invitations_user_id foreign key (created_by_id) references app_users (id);

alter table invitations
    add constraint fk_invitations_event_id foreign key (event_id) references events (id);


/* changes to events table */

alter table events
    add is_public boolean default false not null;

alter table events
    add event_key UUID default gen_random_uuid() not null; /* MariaDB: UUID_v4() */

alter table events
    add constraint uq_events_key unique(event_key);

