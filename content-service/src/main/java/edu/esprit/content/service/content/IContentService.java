package edu.esprit.content.service.content;

import edu.esprit.content.dto.requests.ContentRequest;
import edu.esprit.content.entity.Content;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface IContentService {
    Page<Content> getContentByFilters(List<Long> creatorIds, AccessLevel accessLevel, ContentType contentType, Pageable pageable, Boolean onlyActive);

    Content createContent(Content content);

    Content getContentById(Long id);

    Page<Content> getContentByCreator(Long creatorId, AccessLevel accessLevel, ContentType contentType, Pageable pageable, Boolean onlyActive);

    Content updateContent(Content contentDetails);

    void deleteContent(Long id);

    Content publishContent(Long id);

    Content unpublishContent(Long id);

    boolean existsById(Long id);

    long countAllContent();

    long countContentByCreator(Long creatorId);

}
