package edu.esprit.authentication.dto;

import edu.esprit.authentication.enumeration.UserGender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegisterRequest {
    @Schema(description = "Email address of the user", example = "ADMIN")
//    @Email(message = "Email is not well formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotNull(message = "Email is mandatory")
    private String email;

    @Schema(description = "Username", example = "ADMIN")
    @NotEmpty(message = "Username is mandatory")
    @NotNull(message = "Username is mandatory")
    private String username;

    @Schema(description = "Password for the user (minimum 8 characters)", example = "ADMIN")
    @NotEmpty(message = "Password is mandatory")
    @NotNull(message = "Password is mandatory")
//    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String password;

    @Schema(description = "First name of the user", example = "John")
    @NotEmpty(message = "Firstname is mandatory")
    @NotNull(message = "Firstname is mandatory")
    private String firstName;

    @Schema(description = "Last name of the user", example = "Doe")
    @NotEmpty(message = "Lastname is mandatory")
    @NotNull(message = "Lastname is mandatory")
    private String lastName;

    @Past
    @Schema(description = "Birth Date of the user", example = "01/01/2000")
    private LocalDate birthDate;

    @Schema(description = "Phone  number of the user", example = "55000000")
    @Pattern(regexp = "^\\+?\\(?\\d{1,4}\\)?[-\\s./\\d]*$")
    private String phone;

    @Schema(description = "Gender of the user", example = "MALE")
    private UserGender gender;
}
