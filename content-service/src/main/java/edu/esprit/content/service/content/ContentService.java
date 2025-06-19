package edu.esprit.content.service.content;

import edu.esprit.content.entity.Content;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import edu.esprit.content.exception.ContentNotFoundException;
import edu.esprit.content.repository.ContentRepository;
import edu.esprit.content.utils.ContentSpecifications;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContentService implements IContentService {

    private final ContentRepository contentRepository;

    /**
     * Retrieves content filtered by various criteria with pagination.
     *
     * @param creatorIds List of creator IDs to filter by
     * @param accessLevel Optional access level filter
     * @param contentType Optional content type filter
     * @param pageable Pagination parameters
     * @return Page of filtered content
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Content> getContentByFilters(List<Long> creatorIds, AccessLevel accessLevel,
                                             ContentType contentType, Pageable pageable, Boolean onlyActive) {

        log.debug("Filtering content by creatorIds: {}, accessLevel: {}, contentType: {}",
                creatorIds, accessLevel, contentType);

        // Build dynamic specification based on provided filters
        Specification<Content> specification = Specification
                .where(ContentSpecifications.hasCreatorIds(creatorIds))
                .and(ContentSpecifications.hasAccessLevel(accessLevel))
                .and(ContentSpecifications.hasType(contentType))
                .and(ContentSpecifications.isActive(onlyActive)); // Only return active content

        Page<Content> result = contentRepository.findAll(specification, pageable);

        log.debug("Found {} content items matching filters", result.getTotalElements());
        return result;
    }

    /**
     * Creates new content with automatic timestamp setting.
     *
     * @param content Content entity to create
     * @return Saved content entity
     */
    @Override
    public Content createContent(Content content) {
        // Set creation timestamp
        content.setCreatedAt(LocalDateTime.now());
        content.setUpdatedAt(LocalDateTime.now());


        Content savedContent = contentRepository.save(content);

        log.info("Created new content with ID: {} by creator: {}",
                savedContent.getId(), savedContent.getCreatorId());

        return savedContent;
    }

    /**
     * Retrieves content by ID with detailed error handling.
     *
     * @param id Content ID
     * @return Content entity
     * @throws ContentNotFoundException if content not found
     */
    @Override
    @Transactional(readOnly = true)
    public Content getContentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Content ID cannot be null");
        }

        Optional<Content> contentOptional = contentRepository.findById(id);

        if (contentOptional.isEmpty()) {
            log.warn("Content not found with ID: {}", id);
            throw new ContentNotFoundException("Content not found with id: " + id);
        }

        Content content = contentOptional.get();
        log.debug("Retrieved content: {} with title: '{}'", id, content.getTitle());

        return content;
    }

    /**
     * Retrieves all content created by a specific user.
     *
     * @param creatorId Creator's user ID
     * @return List of content created by the user
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Content> getContentByCreator(Long creatorId, AccessLevel accessLevel,
                                             ContentType contentType, Pageable pageable, Boolean onlyActive) {
        if (creatorId == null) {
            throw new IllegalArgumentException("Creator ID cannot be null");
        }

        log.debug("Retrieving content for creator: {}, accessLevel: {}, contentType: {}",
                creatorId, accessLevel, contentType);

        // Build dynamic specification based on provided filters
        Specification<Content> specification = Specification
                .where(ContentSpecifications.hasCreatorId(creatorId))
                .and(ContentSpecifications.hasAccessLevel(accessLevel))
                .and(ContentSpecifications.hasType(contentType))
                .and(ContentSpecifications.isActive(onlyActive));

        Page<Content> result = contentRepository.findAll(specification, pageable);

        log.debug("Found {} content items for creator", result.getTotalElements());

        return result;
    }

    /**
     * Updates existing content with timestamp update.
     *
     * @param content Content entity to update
     * @return Updated content entity
     */
    @Override
    public Content updateContent(Content content) {
        if (content.getId() == null) {
            throw new IllegalArgumentException("Content ID is required for update");
        }

        // Ensure the content exists
        Content existingContent = getContentById(content.getId());

        // Update timestamp
        content.setUpdatedAt(LocalDateTime.now());

        // Preserve creation timestamp
        if (content.getCreatedAt() == null) {
            content.setCreatedAt(existingContent.getCreatedAt());
        }

        Content updatedContent = contentRepository.save(content);

        log.info("Updated content with ID: {}", updatedContent.getId());
        return updatedContent;
    }

    /**
     * Deletes content by ID with existence validation.
     *
     * @param id Content ID to delete
     * @throws ContentNotFoundException if content not found
     */
    @Override
    public void deleteContent(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Content ID cannot be null");
        }

        // Verify content exists before deletion
        Content content = getContentById(id);

        contentRepository.deleteById(id);

        log.info("Deleted content with ID: {} (title: '{}')", id, content.getTitle());
    }

    /**
     * Publishes content (makes it active and visible).
     *
     * @param id Content ID to publish
     * @return Published content entity
     */
    @Override
    public Content publishContent(Long id) {
        Content content = getContentById(id);

        if (Boolean.TRUE.equals(content.isActive())) {
            log.debug("Content with ID: {} is already published", id);
            return content;
        }

        content.setActive(true);
        content.setUpdatedAt(LocalDateTime.now());

        Content publishedContent = contentRepository.save(content);

        log.info("Published content with ID: {} (title: '{}')", id, content.getTitle());
        return publishedContent;
    }

    /**
     * Unpublishes content (makes it inactive and hidden).
     *
     * @param id Content ID to unpublish
     * @return Unpublished content entity
     */
    @Override
    public Content unpublishContent(Long id) {
        Content content = getContentById(id);

        if (Boolean.FALSE.equals(content.isActive())) {
            log.debug("Content with ID: {} is already unpublished", id);
            return content;
        }

        content.setActive(false);
        content.setUpdatedAt(LocalDateTime.now());

        Content unpublishedContent = contentRepository.save(content);

        log.info("Unpublished content with ID: {} (title: '{}')", id, content.getTitle());
        return unpublishedContent;
    }

    /**
     * Checks if content exists by ID.
     *
     * @param id Content ID
     * @return true if content exists, false otherwise
     */
    @Override
    public boolean existsById(Long id) {
        if (id == null) {
            return false;
        }

        boolean exists = contentRepository.existsById(id);
        log.debug("Content exists check for ID {}: {}", id, exists);
        return exists;
    }

    /**
     * Counts total content items.
     *
     * @return Total count of content items
     */
    @Transactional(readOnly = true)
    @Override
    public long countAllContent() {
        long count = contentRepository.count();
        log.debug("Total content count: {}", count);
        return count;
    }

    /**
     * Counts content items by creator.
     *
     * @param creatorId Creator's user ID
     * @return Count of content items by creator
     */
    @Transactional(readOnly = true)
    @Override
    public long countContentByCreator(Long creatorId) {
        if (creatorId == null) {
            return 0;
        }

        long count = contentRepository.countByCreatorId(creatorId);
        log.debug("Content count for creator {}: {}", creatorId, count);
        return count;
    }
}
