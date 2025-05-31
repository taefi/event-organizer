package com.github.taefi.organizer.event.service;

import com.github.taefi.organizer.base.security.AuthenticatedUser;
import com.github.taefi.organizer.event.data.Event;
import com.github.taefi.organizer.event.data.EventRepository;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import com.vaadin.hilla.crud.filter.AndFilter;
import com.vaadin.hilla.crud.filter.Filter;
import com.vaadin.hilla.crud.filter.PropertyStringFilter;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@PermitAll
public class EventCrudService extends CrudRepositoryService<Event, Long, EventRepository> {

    @Autowired
    AuthenticatedUser authenticatedUser;

    @RolesAllowed("ORGANIZER")
    @Override
    public @Nullable Event save(Event event) {
        // TODO: introduce DTO to prevent overwriting the organizer or key
        if (event.getId() == null) {
            event.setOrganizer(authenticatedUser.get().get());
            event.setKey(UUID.randomUUID());
        }
        return super.save(event);
    }

    @Override
    public List<Event> list(Pageable pageable, @Nullable Filter filter) {
        // Only show events for the authenticated user
        filter = new AndFilter(filter, new PropertyStringFilter(
                "organizer.id",
                PropertyStringFilter.Matcher.EQUALS,
                authenticatedUser.get().get().getId().toString())
        );
        return super.list(pageable, filter);
    }
}
