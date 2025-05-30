package com.github.taefi.organizer.base.services;


import com.github.taefi.organizer.base.data.Role;

public interface UserService {

    void createUser(String email, String password, String name, Role role);

    boolean isEmailAvailable(String email);
}
