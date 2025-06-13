package edu.esprit.authentication.controller;

import edu.esprit.authentication.dto.*;
import edu.esprit.authentication.entity.User;
import edu.esprit.authentication.service.auth.AuthService;
import edu.esprit.authentication.service.user.UserService;
import edu.esprit.authentication.utilis.UserMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("auth")
@Tag(name = "Authentication", description = "Web Services for authentication")
public class AuthController {
    private final AuthService service;
    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<Object> register(@RequestBody @Valid RegisterRequest request) {
        if (userService.usernameExists(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }

        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken");
        }

        var user = service.register(request);

        RegisterResponse response = RegisterResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .build();

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }


    @PostMapping("/verify_token")
    public ResponseEntity<UserDTO> getUserByToken(@RequestParam String token) {
        User user = service.getUserByToken(token);

        UserDTO userDTO = UserMapper.toUserDTO(user);

        // Return the response received from the external API
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userDTO);
    }

}
