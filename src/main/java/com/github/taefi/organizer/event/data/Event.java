package com.github.taefi.organizer.event.data;

import com.github.taefi.organizer.base.data.AbstractEntity;
import com.github.taefi.organizer.base.data.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event extends AbstractEntity {
    @NotBlank
    @Column(length = 150)
    private String title;

    @Column(length = 2000)
    private String description;

    @NotNull
    @Column(name = "start_date_time")
    private LocalDateTime start;

    @NotNull
    @Column(name = "end_date_time")
    private LocalDateTime end;

    @NotBlank
    @Column
    private String location;

    @NotNull
    @Column
    private Integer capacity;

    @NotNull
    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "event_key")
    private UUID key;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User organizer;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public UUID getKey() {
        return key;
    }

    public void setKey(UUID key) {
        this.key = key;
    }
}
