package edu.esprit.content.dto;


import edu.esprit.content.dto.user.UserDTO;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentDTO {
    private Long id;
    private Long creatorId;
    private String storageUrl;
    private String thumbnailUrl;
    private ContentType contentType;
    private AccessLevel accessLevel;
    private Double price;
    private String title;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UserDTO creator;
}