package edu.esprit.authentication.service.auth;

import edu.esprit.authentication.dto.LoginRequest;
import edu.esprit.authentication.dto.LoginResponse;
import edu.esprit.authentication.dto.RegisterRequest;
import edu.esprit.authentication.entity.User;
import edu.esprit.authentication.repository.UserRepository;
import edu.esprit.authentication.security.JwtService;
import edu.esprit.authentication.service.user.UserService;
import edu.esprit.authentication.utilis.UserMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    @Override
    public User register(RegisterRequest request) {
        return userService.add(UserMapper.toUser(request));
    }



    @Override
    public LoginResponse authenticate(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var claims = new HashMap<String, Object>();
        User user = (User) auth.getPrincipal();

        claims.put("fullName", user.getFullName());
        claims.put("email", user.getEmail());
        claims.put("roles", Collections.emptyList());

        var authToken = jwtService.generateToken(claims, user);

        return LoginResponse.builder()
                .authToken(authToken)
                .build();
    }

    @Transactional
    @Override
    public User getUserByToken(String jwt) {
        // Extract the user email from the token
        String username = jwtService.extractUsername(jwt);

        // Retrieve the user from the repository using the email
        User user = userRepository.findByUsername(username).orElse(null);

        // Return null if the user doesn't exist or the token is not valid for the user
        if (user == null || !jwtService.isTokenValid(jwt, user)) {
            return null;
        }

        user.setLastLogin(LocalDateTime.now());

        return user;
    }
}
