package edu.esprit.content.dto.requests;

import edu.esprit.content.enumeration.AccessLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentRequest {
    @NotBlank(message = "Title cannot be blank")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    @Schema(description = "Title of the content", example = "My Awesome Post")
    private String title;


    @Size(max = 5000, message = "Text content cannot exceed 5000 characters")
    @Schema(description = "Actual text content for TEXT type posts")
    private String description;

    @NotNull(message = "Creator ID cannot be null")
    @Positive(message = "Creator ID must be positive")
    @Schema(description = "ID of the content creator", example = "123")
    private Long creatorId;

    private Double price;

    private AccessLevel accessLevel;

    private boolean active;

}