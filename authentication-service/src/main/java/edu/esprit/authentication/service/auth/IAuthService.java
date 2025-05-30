package edu.esprit.authentication.service.auth;

import edu.esprit.authentication.dto.LoginRequest;
import edu.esprit.authentication.dto.LoginResponse;
import edu.esprit.authentication.dto.RegisterRequest;
import edu.esprit.authentication.entity.User;


public interface IAuthService {

    User register(RegisterRequest request);

    LoginResponse authenticate(LoginRequest request);

    User getUserByToken(String jwt);
}
