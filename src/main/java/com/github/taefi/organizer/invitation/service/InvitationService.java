package com.github.taefi.organizer.invitation.service;

import com.github.taefi.organizer.base.data.User;
import com.github.taefi.organizer.base.security.AuthenticatedUser;
import com.github.taefi.organizer.event.data.Event;
import com.github.taefi.organizer.event.service.EventCrudService;
import com.github.taefi.organizer.invitation.data.Invitation;
import com.github.taefi.organizer.invitation.data.InvitationRepository;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Arrays;

@BrowserCallable
@RolesAllowed("ORGANIZER")
public class InvitationService {
    public record InvitationResult(String email, boolean success) {}

    private final AuthenticatedUser authenticatedUser;
    private final InvitationRepository invitationRepository;
    private final EventCrudService eventCrudService;

    private User currentUser;

    public InvitationService(AuthenticatedUser authenticatedUser,
                             InvitationRepository invitationRepository,
                             EventCrudService eventCrudService) {
        this.authenticatedUser = authenticatedUser;
        this.invitationRepository = invitationRepository;
        this.eventCrudService = eventCrudService;
    }

    @Transactional
    public Flux<InvitationResult> sendInvitations(String emails, Long eventId) {
        currentUser = authenticatedUser.get().orElseThrow(() ->
                new IllegalStateException("User not authenticated"));
        var event = eventCrudService.get(eventId);
        if (event.isEmpty()) {
            return Flux.error(new IllegalArgumentException("Event not found"));
        }

        var emailList = Arrays.stream(emails.split(","))
                    .map(String::trim)
                    .filter(email -> !email.isEmpty())
                    .toList();
        return Flux.fromIterable(emailList).flatMap(email ->
                    Mono.fromCallable(() -> createInvitation(email, event.get()))
                            .subscribeOn(Schedulers.boundedElastic())
                );
    }

    private InvitationResult createInvitation(String email, Event event) {
        try {
            Thread.sleep((long) (Math.random() * 1000) + 500); // Simulate a delay for sending email
            Invitation invitation = new Invitation();
            invitation.setReceiverEmail(email);
            invitation.setCreatedBy(currentUser);
            invitation.setEvent(event);
            invitation.setKey(java.util.UUID.randomUUID());
            invitationRepository.save(invitation);
            return new InvitationResult(email, true);
        } catch (Exception e) {
            return new InvitationResult(email, false);
        }
    }
}
