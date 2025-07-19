package com.example.authentification_test.service;

import com.example.authentification_test.respository.UserRepository;
import com.example.authentification_test.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private  final UserRepository userRespository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = userRespository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found:" + email));

        return new UserDetailsImpl(user);
    }
}
