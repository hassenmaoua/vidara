package edu.esprit.authentication.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginRequest {

    @Schema(description = "Email of user", example = "ADMIN")
//    @Email(message = "Email is not well formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotNull(message = "Email is mandatory")
    private String email;

    @Schema(description = "Password of the user", example = "ADMIN")
    @NotEmpty(message = "Password is mandatory")
    @NotNull(message = "Password is mandatory")
    private String password;
}
