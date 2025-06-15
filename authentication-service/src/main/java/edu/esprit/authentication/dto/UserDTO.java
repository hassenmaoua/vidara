package edu.esprit.authentication.dto;

import edu.esprit.authentication.enumeration.UserGender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
    long id;
    String username;
    String email;
    String firstName;
    String lastName;
    String fullName;
    String avatar;
    String cover;
    String bio;
    UserGender gender;
    LocalDate birthDate;
    String country;
    String language;
    int age;
    String phone;
    List<String> roles;
    boolean enabled;
    boolean accountLocked;
    LocalDateTime lastLogin;
}