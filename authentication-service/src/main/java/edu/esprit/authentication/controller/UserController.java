package edu.esprit.authentication.controller;


import edu.esprit.authentication.dto.UserDTO;
import edu.esprit.authentication.security.AccessService;
import edu.esprit.authentication.service.user.UserService;
import edu.esprit.authentication.utilis.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name = "User Management", description = "Web Services for User management")
@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final AccessService accessService;

    @PostMapping("/batch")
    public ResponseEntity<List<UserDTO>> getUsersByIds(@RequestBody List<Long> ids) {
        List<UserDTO> users = userService.findUsersByIds(ids).stream()
                .map(UserMapper::toUserDTO)
                .toList();
        return ResponseEntity.ok(users);
    }

    @Operation(
            operationId = "load-username",
            summary = "Get user by username",
            description = "Retrieve a user by username.")
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getByUsername(@PathVariable("username") String username) {
        var user = userService.getByUsername(username);
        UserDTO userDTO = UserMapper.toUserDTO(user);
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }


    @Operation(
            operationId = "load-user",
            summary = "Get user by ID",
            description = "Retrieve a user by ID.")
    @GetMapping("/load/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable("id") Long userId) {
        var user = userService.get(userId);
        UserDTO userDTO = UserMapper.toUserDTO(user);
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }


    @Operation(
            operationId = "updatePassword",
            summary = "Update password",
            description = "Change user password.")
    @PutMapping("/change-password")
    public ResponseEntity<UserDTO> updatePassword(@RequestParam Long userId, @RequestParam String oldPassword, @RequestParam String newPassword) {
        var user = userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok(UserMapper.toUserDTO(user));
    }

    @Operation(
            operationId = "disableAccount",
            summary = "Disable Account",
            description = "User self disable account.")
    @DeleteMapping("/disable")
    public ResponseEntity<Void> disableAccount() {
        var user = accessService.getCurrentUser();

        userService.disableAccount(user);
        return ResponseEntity.noContent().build();
    }
}
