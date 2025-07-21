package com.github.taefi.organizer.base.services;

import com.github.taefi.organizer.base.data.Role;
import com.github.taefi.organizer.base.data.User;
import com.github.taefi.organizer.base.data.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserDetailsServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("No user present with email: " + username);
        } else {
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getHashedPassword(),
                    getAuthorities(user));
        }
    }

    private static List<GrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }

    @Override
    public void createUser(String email, String password, String name, Role role) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setHashedPassword(passwordEncoder.encode(password));
        newUser.setName(name);
        var roles = role == Role.ORGANIZER ? Set.of(Role.ORGANIZER, Role.ATTENDEE) : Set.of(Role.ATTENDEE);
        newUser.setRoles(roles);
        newUser.setProfilePicture(new byte[0]);
        userRepository.save(newUser);
    }

    @Override
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Override
    public List<User> findByEmailIn(List<String> emails) {
        return userRepository.findByEmailIn(emails);
    }
}
