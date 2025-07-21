package com.github.taefi.organizer.base.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

@Entity
@Table(name = "app_users")
public class User extends AbstractEntity {
    @Email
    @NotBlank
    @Column(length = 50, unique = true)
    private String email;

    @NotBlank
    private String name;

    @JsonIgnore
    private String hashedPassword;

    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "user_roles",
        joinColumns = @JoinColumn(
            name = "user_id",
            foreignKey = @ForeignKey(
                    name = "fk_user_roles_user_id",
                    foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES app_users(id)"
            )
        )
    )
    @Column(name = "role")
    @NotEmpty
    private Set<Role> roles;

    @Column(length = 1000000)
    private byte[] profilePicture;

    @NotNull
    public String getEmail() {
        return email;
    }
    public void setEmail(String username) {
        this.email = username;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }
    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public Set<Role> getRoles() {
        return roles;
    }
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @NotNull
    public byte[] getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }
}
