package com.github.taefi.organizer.base.services;


import com.github.taefi.organizer.base.data.Role;
import com.github.taefi.organizer.base.data.User;

import java.util.List;

public interface UserService {

    void createUser(String email, String password, String name, Role role);

    boolean isEmailAvailable(String email);

    List<User> findByEmailIn(List<String> emails);
}
