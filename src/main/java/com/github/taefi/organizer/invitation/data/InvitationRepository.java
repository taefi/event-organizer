package com.github.taefi.organizer.invitation.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InvitationRepository extends JpaRepository<Invitation, Long>,
        JpaSpecificationExecutor<Invitation> {
}
