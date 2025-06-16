package edu.esprit.content.client;

import edu.esprit.content.dto.user.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "authentication-service") // matches Eureka app name
public interface UserClient {

    @GetMapping("/users/load/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @PostMapping("/users/batch")
    List<UserDTO> getUsersByIds(@RequestBody List<Long> ids);

    @GetMapping("/users/{username}")
    UserDTO getByUsername(@PathVariable("username") String username);
}

