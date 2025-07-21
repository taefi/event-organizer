package com.github.taefi.organizer.base.security;

import com.vaadin.flow.spring.security.VaadinWebSecurity;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.AbstractRequestMatcherRegistry;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfiguration extends VaadinWebSecurity {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Public access
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
//        http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/")).permitAll());
//        http.authorizeHttpRequests(
//                authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/signup")).permitAll());
//        http.authorizeHttpRequests(
//                authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/login")).permitAll());
//        http.authorizeHttpRequests(
//                authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/images/*.png")).permitAll());
//        // Icons from the line-awesome addon
//        http.authorizeHttpRequests(authorize -> authorize
//                .requestMatchers(new AntPathRequestMatcher("/line-awesome/**/*.svg")).permitAll());
//
//        http.formLogin(formLogin -> formLogin
//                .defaultSuccessUrl("/")
//                .successForwardUrl("/")
//        );
//        super.configure(http);
        setLoginView(http, "/login");
    }

}
