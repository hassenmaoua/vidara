package edu.esprit.content.utils;

import edu.esprit.content.dto.ContentDTO;
import edu.esprit.content.dto.requests.ContentRequest;
import edu.esprit.content.dto.user.UserDTO;
import edu.esprit.content.entity.Content;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ContentMapper {
    private ContentMapper() {}

    public static Content toContent(ContentRequest contentRequest) {
        return Content.builder()
                .accessLevel(contentRequest.getAccessLevel())
                .title(contentRequest.getTitle())
                .description(contentRequest.getDescription())
                .creatorId(contentRequest.getCreatorId())
                .isActive(true)
                .build();
    }

    public static ContentDTO toDto(Content content) {
        return ContentDTO.builder()
                .id(content.getId())
                .title(content.getTitle())
                .contentType(content.getContentType())
                .description(content.getDescription())
                .creatorId(content.getCreatorId())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .isActive(content.isActive())
                .storageUrl(content.getStorageUrl())
                .build();
    }

    public static ContentDTO toDto(Content content, UserDTO user) {
        return ContentDTO.builder()
                .id(content.getId())
                .creatorId(content.getCreatorId())
                .storageUrl(content.getStorageUrl())
                .contentType(content.getContentType())
                .accessLevel(content.getAccessLevel())
                .price(content.getPrice())
                .title(content.getTitle())
                .description(content.getDescription())
                .isActive(content.isActive())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .creator(user)
                .build();
    }

    public static void updateEntityFromRequest(ContentRequest contentRequest, Content content) {
        content.setTitle(contentRequest.getTitle());
        content.setDescription(contentRequest.getDescription());

        if (contentRequest.getCreatorId() != null) {
            content.setCreatorId(contentRequest.getCreatorId());
        }
    }
}
