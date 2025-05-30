package edu.esprit.authentication.dto;

import lombok.*;

@Getter
@Setter
@Builder
public class RegisterResponse {
    private Long id;
    private String email;
}
