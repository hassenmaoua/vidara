package edu.esprit.authentication.entity;

import edu.esprit.authentication.enumeration.UserGender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.time.Period;
import java.util.Collection;
import java.util.List;


@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
@EntityListeners(AuditingEntityListener.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User implements UserDetails, Principal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    Long id;

    @Column(name = "username", nullable = false, unique = true)
    String username;

    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Column(name = "password", nullable = false)
    String password;

    @Column(name = "first_name", nullable = false)
    String firstName;

    @Column(name = "last_name", nullable = true)
    String lastName;

    @Column(name = "full_name", nullable = false)
    String fullName;

    @Column(name = "avatar", nullable = true)
    String avatar;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    UserGender gender;

    @Column(name = "birth_date")
    LocalDate birthDate;

    @Column(name = "phone")
    String phone;

    @Column(name = "locked")
    boolean accountLocked;

    @Column(name = "enabled")
    boolean enabled;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) () -> "USER_ROLE");
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String fullName() {
        return getFirstName() + " " + getLastName();
    }

    @Override
    public String getName() {
        return email;
    }


    public int getAge() {
        if (birthDate == null) {
            return 0;
        }
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
