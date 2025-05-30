package edu.esprit.authentication.service.user;


import edu.esprit.authentication.entity.User;

public interface IUserService {

    User add(User user);

    User update(User user);

    User get(Long id);

    User get(String email);

    boolean emailExists(String email);

    User changeEmail(String oldEmail, String newEmail);

    User changePassword(Long userId,String oldPassword, String newPassword);

    boolean userExists(String username);

    void disableAccount(User user);
}
