package edu.esprit.authentication.service.user;


import edu.esprit.authentication.entity.User;

import java.util.List;

public interface IUserService {

    User add(User user);

    User update(User user);

    User get(Long id);

    User get(String email);

    User getByUsername(String username);

    boolean emailExists(String email);

    boolean usernameExists(String username);

    User changeEmail(String oldEmail, String newEmail);

    User changePassword(Long userId, String oldPassword, String newPassword);

    void disableAccount(User user);

    List<User> findUsersByIds(List<Long> ids);

}
