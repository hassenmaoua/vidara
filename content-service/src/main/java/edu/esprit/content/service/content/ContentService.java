package edu.esprit.content.service.content;

import edu.esprit.content.dto.requests.ContentRequest;
import edu.esprit.content.entity.Content;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import edu.esprit.content.exception.ContentNotFoundException;
import edu.esprit.content.repository.ContentRepository;
import edu.esprit.content.utils.ContentMapper;
import edu.esprit.content.utils.ContentSpecifications;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@AllArgsConstructor
public class ContentService implements IContentService {
    private final ContentRepository contentRepository;

    @Override
    public Page<Content> getContentByFilters(List<Long> creatorIds, AccessLevel accessLevel, ContentType contentType, Pageable pageable) {
        Specification<Content> spec = Specification
                .where(ContentSpecifications.hasCreatorIds(creatorIds))
                .and(ContentSpecifications.hasAccessLevel(accessLevel))
                .and(ContentSpecifications.hasType(contentType));

        return contentRepository.findAll(spec, pageable);
    }

    @Override
    public Content createContent(Content content) {
        return contentRepository.save(content);
    }

    @Override
    public Content getContentById(Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new ContentNotFoundException("Content not found with id: " + id));
    }

    @Override
    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    @Override
    public List<Content> getContentByCreator(Long creatorId) {
        return contentRepository.findByCreatorId(creatorId);
    }

    @Override
    public Content updateContent(Content content) {
        return contentRepository.save(content);
    }

    @Override
    public void deleteContent(Long id) {
        Content content = getContentById(id);
        contentRepository.delete(content);
    }

    @Override
    public Content publishContent(Long id) {
        Content content = getContentById(id);
        content.setActive(true);
        return contentRepository.save(content);
    }

    @Override
    public Content unpublishContent(Long id) {
        Content content = getContentById(id);
        content.setActive(false);
        return contentRepository.save(content);
    }

//    @Override
//    public Content getContentWithUrl(Long id) {
//        Content content = getContentById(id);
//        if (content.getFilename() != null) {
//            String fileUrl = "/api/v1/content/files/" + content.getFilename();
//            // You can use reflection or a DTO to set this if needed
//        }
//        return content;
//    }
}
