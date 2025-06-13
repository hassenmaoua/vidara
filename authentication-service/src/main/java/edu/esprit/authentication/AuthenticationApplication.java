package edu.esprit.authentication;

import edu.esprit.authentication.entity.User;
import edu.esprit.authentication.enumeration.UserGender;
import edu.esprit.authentication.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableCaching
@SpringBootApplication
public class AuthenticationApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthenticationApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(UserRepository userRepository, PasswordEncoder passwordEncoder) {

        return args -> {
            final String defaultUser = "ADMIN";
            if (userRepository.findByUsername(defaultUser).isEmpty()) {
                userRepository.save(User.builder()
                        .firstName(defaultUser)
                        .fullName(defaultUser)
                        .lastName(defaultUser)
                        .username(defaultUser)
                        .language("EN")
                        .country("TN")
//                        .phone("00000000")
                        .gender(UserGender.MALE)
                        .password(passwordEncoder.encode(defaultUser))
                        .email(defaultUser)
                        .accountLocked(false)
                        .enabled(true)
                        .build());
            }
        };
    }

}
