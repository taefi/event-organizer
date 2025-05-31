package com.github.taefi.organizer.invitation.data;

import com.github.taefi.organizer.base.data.AbstractEntity;
import com.github.taefi.organizer.base.data.User;
import com.github.taefi.organizer.event.data.Event;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "invitations")
public class Invitation extends AbstractEntity {

    @Column(name = "invitation_key")
    private UUID key;

    @Column
    private String receiverEmail;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private Event event;

    public Invitation() {
    }

    public UUID getKey() {
        return key;
    }

    public void setKey(UUID key) {
        this.key = key;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}
