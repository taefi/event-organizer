CREATE SEQUENCE id_sequence
    START WITH 100
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775806
    CACHE 50;

CREATE TABLE app_users
(
    id              BIGINT       NOT NULL,
    version         INT          NOT NULL,
    email           VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NULL,
    hashed_password VARCHAR(255) NULL,
    profile_picture BYTEA        NULL, /* BLOB */
    CONSTRAINT pk_app_users PRIMARY KEY (id),
    CONSTRAINT uq_app_users_email UNIQUE (email)
);

CREATE TABLE user_roles
(
    user_id BIGINT       NOT NULL,
    role    VARCHAR(255) NULL
);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES app_users (id);

CREATE TABLE events
(
    id              BIGINT        NOT NULL,
    version         INT           NOT NULL,
    title           VARCHAR(150)  NOT NULL,
    description     VARCHAR(2000) NULL,
    start_date_time timestamp     NOT NULL,
    end_date_time   timestamp     NOT NULL,
    location        VARCHAR(255)  NOT NULL,
    capacity        INT           NOT NULL,
    user_id         BIGINT        NOT NULL,
    CONSTRAINT pk_events PRIMARY KEY (id)
);

ALTER TABLE events
    ADD CONSTRAINT fk_event_organizer_user_id FOREIGN KEY (user_id) REFERENCES app_users (id);

