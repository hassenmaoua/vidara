package edu.esprit.content.service.content;

import edu.esprit.content.dto.requests.ContentRequest;
import edu.esprit.content.entity.Content;


import java.util.List;

public interface IContentService {
    Content createContent(Content content);

    Content getContentById(Long id);

    List<Content> getAllContent();

    List<Content> getContentByCreator(Long creatorId);

    Content updateContent(Long id, ContentRequest contentDetails);

    void deleteContent(Long id);

    Content publishContent(Long id);

    Content unpublishContent(Long id);
}
