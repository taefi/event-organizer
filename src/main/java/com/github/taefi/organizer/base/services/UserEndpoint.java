package com.github.taefi.organizer.base.services;

import com.github.taefi.organizer.base.data.Role;
import com.github.taefi.organizer.base.security.AuthenticatedUser;
import com.github.taefi.organizer.base.data.User;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Optional;

@BrowserCallable
@AnonymousAllowed
public class UserEndpoint {

    private final AuthenticatedUser authenticatedUser;
    private final UserService userService;

    public UserEndpoint(AuthenticatedUser authenticatedUser, UserService userService) {
        this.authenticatedUser = authenticatedUser;
        this.userService = userService;
    }

    public Optional<User> getAuthenticatedUser() {
        return authenticatedUser.get();
    }

    public boolean isEmailAvailable(String email) {
        return userService.isEmailAvailable(email);
    }

    public CreateUserResponse createUser(NewUser newUser) {
        try {
            userService.createUser(newUser.email, newUser.password, newUser.name, newUser.role);
            return new CreateUserResponse(true, null);
        } catch (Exception e) {
            return new CreateUserResponse(false, e.getMessage());
        }
    }

    public record NewUser(
            @NotBlank
            @Email
            String email,
            @NotBlank
            String name,
            @NotBlank
            @Min(value = 4, message = "Password must be at least 4 characters long")
            String password,
            @NotBlank
            String confirmPassword,
            @NotNull
            Role role) {
    }

    public record CreateUserResponse(
            boolean success,
            String errorMessage
    ){}
}
