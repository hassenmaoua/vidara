package edu.esprit.authentication.utilis;

import edu.esprit.authentication.dto.RegisterRequest;
import edu.esprit.authentication.dto.UserDTO;
import edu.esprit.authentication.entity.User;
import org.springframework.stereotype.Service;


@Service
public class UserMapper {

    private UserMapper() {}

    public static UserDTO toUserDTO(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .cover(user.getCover())
                .bio(user.getBio())
                .gender(user.getGender())
                .birthDate(user.getBirthDate())
                .age(user.getAge())
                .country(user.getCountry())
                .language(user.getLanguage())
//                .phone(user.getPhone())
                .enabled(user.isEnabled())
                .accountLocked(user.isAccountLocked())
                .build();
    }

    public static User toUser(RegisterRequest request) {
        User user = new User();

        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setFullName(request.getFirstName() + " " + request.getLastName());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());
        user.setLanguage(request.getLanguage());
//        user.setPhone(request.getPhone());
        user.setEnabled(true);

        return user;
    }
}
