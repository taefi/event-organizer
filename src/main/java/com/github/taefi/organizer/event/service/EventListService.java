package com.github.taefi.organizer.event.service;

import com.github.taefi.organizer.event.data.Event;
import com.github.taefi.organizer.event.data.EventRepository;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.ListRepositoryService;
import jakarta.annotation.security.PermitAll;

@BrowserCallable
@PermitAll
public class EventListService extends ListRepositoryService<Event, Long, EventRepository> {
}
