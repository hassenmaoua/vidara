package edu.esprit.content.controller;

import edu.esprit.content.client.UserClient;
import edu.esprit.content.dto.ContentDTO;
import edu.esprit.content.dto.requests.ContentRequest;
import edu.esprit.content.dto.user.UserDTO;
import edu.esprit.content.entity.Content;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import edu.esprit.content.service.content.ContentService;
import edu.esprit.content.service.storage.StorageService;
import edu.esprit.content.utils.ContentMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * REST Controller for Content Management operations.
 * Handles CRUD operations, file uploads, and content publishing.
 * All exceptions are handled globally by GlobalExceptionHandler.
 *
 * @author Generated
 * @version 1.0
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/contents")
@Tag(name = "Content Management", description = "APIs for managing content creation, retrieval, and file operations")
@Validated
public class ContentController {

    private final ContentService contentService;
    private final StorageService storageService;
    private final UserClient userClient;

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String DEFAULT_SORT_FIELD = "createdAt";

    /**
     * Creates new content with optional file upload.
     *
     * @param accessLevel The access level for the content
     * @param title       Optional title for the content
     * @param description Optional description for the content
     * @param price       Optional price for pay-per-view content
     * @param active      Optional active state for the content
     * @param file        Optional file to upload
     * @param request     HTTP request to extract user information
     * @return ResponseEntity containing the created content DTO
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create new content", description = "Creates new content with optional file upload")
    public ResponseEntity<ContentDTO> createContent(
            @RequestParam(value = "accessLevel") AccessLevel accessLevel,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "active", required = false, defaultValue = "TRUE") Boolean active,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) throws IOException {

        // Extract and validate user
        UserDTO user = extractAndValidateUser(request);

        // Build content request
        ContentRequest contentRequest = buildContentRequest(user.getId(), accessLevel, title, description, price, active);

        // Log request details
        logContentCreationRequest(contentRequest, file);

        // Create content entity
        Content content = ContentMapper.toContent(contentRequest);

        // Handle file upload if present
        processFileUpload(file, content, title);

        // Save and return content
        Content savedContent = contentService.createContent(content);

        log.info("Content created successfully with ID: {}", savedContent.getId());
        return ResponseEntity.ok(ContentMapper.toDto(savedContent));
    }

    /**
     * Retrieves paginated content filtered by creator IDs and other criteria.
     *
     * @param creatorIds  List of creator IDs to filter by
     * @param accessLevel Optional access level filter
     * @param contentType Optional content type filter
     * @param page        Page number (0-based)
     * @param size        Page size
     * @return ResponseEntity containing paginated content DTOs
     */
    @GetMapping
    @Operation(summary = "Get filtered content", description = "Retrieves content with filters and pagination")
    public ResponseEntity<Page<ContentDTO>> getFilteredContent(
            @RequestParam @NotEmpty List<Long> creatorIds,
            @RequestParam(required = false) AccessLevel accessLevel,
            @RequestParam(required = false) ContentType contentType,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size) {

        // Create pageable with sorting
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, DEFAULT_SORT_FIELD));

        // Get content with filters
        Page<Content> contentPage = contentService.getContentByFilters(
                creatorIds, accessLevel, contentType, pageable, true);

        // Get creator information
        Map<Long, UserDTO> creatorMap = getCreatorMap(creatorIds);

        // Map to DTOs with creator information
        Page<ContentDTO> dtoPage = contentPage.map(content -> {
            UserDTO creator = creatorMap.get(content.getCreatorId());
            return ContentMapper.toDto(content, creator);
        });

        log.debug("Retrieved {} content items for creators: {}",
                dtoPage.getTotalElements(), creatorIds);

        return ResponseEntity.ok(dtoPage);
    }

    /**
     * Updates existing content with optional file upload.
     * Only the content creator can update their content.
     *
     * @param id          Content ID to update
     * @param accessLevel Optional new access level
     * @param title       Optional new title
     * @param description Optional new description
     * @param price       Optional new price
     * @param file        Optional new file
     * @param request     HTTP request to extract user information
     * @return ResponseEntity containing updated content DTO
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update content", description = "Updates existing content with optional file replacement")
    public ResponseEntity<ContentDTO> updateContent(
            @PathVariable Long id,
            @RequestParam(value = "accessLevel", required = false) AccessLevel accessLevel,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "active", required = false, defaultValue = "TRUE") Boolean active,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) throws IOException {

        // Get existing content and validate ownership
        Content content = contentService.getContentById(id);
        UserDTO user = extractAndValidateUser(request);

        validateContentOwnership(user, content);

        // Update content fields
        updateContentFields(content, accessLevel, title, description, price, active);

        // Handle file update if present
        if (file != null && !file.isEmpty()) {
            processFileUpload(file, content, null);
        }

        // Save and return updated content
        Content updatedContent = contentService.updateContent(content);

        log.info("Content updated successfully with ID: {}", id);
        return ResponseEntity.ok(ContentMapper.toDto(updatedContent));
    }

    /**
     * Retrieves a single content item by ID.
     *
     * @param id Content ID
     * @return ResponseEntity containing content DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get content by ID", description = "Retrieves a single content item")
    public ResponseEntity<ContentDTO> getContentById(@PathVariable Long id) {

        Content content = contentService.getContentById(id);
        UserDTO creator = userClient.getUserById(content.getCreatorId());

        log.debug("Retrieved content with ID: {}", id);
        return ResponseEntity.ok(ContentMapper.toDto(content, creator));
    }

    /**
     * Retrieves all content created by a specific user.
     *
     * @param creatorId Creator's user ID
     * @param accessLevel Optional new access level
     * @param contentType Optional content type filter
     * @param page        Page number (0-based)
     * @param size        Page size
     * @param request     HTTP request to extract user information
     * @return ResponseEntity containing list of content DTOs
     */
    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "Get content by creator", description = "Retrieves all content from a specific creator")
    public ResponseEntity<Page<ContentDTO>> getContentByCreator(
            @PathVariable Long creatorId,
            @RequestParam(required = false) AccessLevel accessLevel,
            @RequestParam(required = false) ContentType contentType,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            HttpServletRequest request) throws AccessDeniedException {


        UserDTO currentUser = extractAndValidateUser(request);

        // Create pageable with sorting
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, DEFAULT_SORT_FIELD));

        Page<ContentDTO> dtoPage;

        boolean isOwner = Objects.equals(currentUser.getId(), creatorId);

        // Get content with filters
        Page<Content> contentPage = contentService.getContentByCreator(
                creatorId, accessLevel, contentType, pageable, !isOwner);

        // Map to DTOs with creator information
        if (isOwner) {
            dtoPage = contentPage.map(content -> ContentMapper.toDto(content, currentUser));
        } else {
            UserDTO creator = userClient.getUserById(creatorId);
            dtoPage = contentPage.map(content -> ContentMapper.toDto(content, creator));
        }

        log.debug("Retrieved {} content items for creator: {}", dtoPage.getTotalElements(), creatorId);
        return ResponseEntity.ok(dtoPage);
    }

    /**
     * Deletes a content item.
     *
     * @param id Content ID to delete
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete content", description = "Deletes a content item")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) throws IOException {

        Content content = contentService.getContentById(id);
        contentService.deleteContent(content.getId());
        storageService.delete(content.getStorageUrl());
        log.info("Content deleted with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Publishes content (makes it active).
     *
     * @param id Content ID to publish
     * @return ResponseEntity containing published content
     */
    @PutMapping("/{id}/publish")
    @Operation(summary = "Publish content", description = "Makes content active and visible")
    public ResponseEntity<ContentDTO> publishContent(@PathVariable Long id) {

        Content publishedContent = contentService.publishContent(id);
        log.info("Content published with ID: {}", id);
        return ResponseEntity.ok(ContentMapper.toDto(publishedContent));
    }

    /**
     * Unpublishes content (makes it inactive).
     *
     * @param id Content ID to unpublish
     * @return ResponseEntity containing unpublished content
     */
    @PutMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish content", description = "Makes content inactive and hidden")
    public ResponseEntity<ContentDTO> unpublishContent(@PathVariable Long id) {

        Content unpublishedContent = contentService.unpublishContent(id);
        log.info("Content unpublished with ID: {}", id);
        return ResponseEntity.ok(ContentMapper.toDto(unpublishedContent));
    }

    /**
     * Downloads the file associated with a content item.
     *
     * @param id Content ID
     * @return ResponseEntity containing the file resource
     */
    @GetMapping("/{id}/download")
    @Operation(summary = "Download content file", description = "Downloads the file associated with content")
    public ResponseEntity<Resource> downloadContentFile(@PathVariable Long id) {

        Content content = contentService.getContentById(id);

        if (content.getStorageUrl() == null) {
            log.warn("No file associated with content ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        Resource file = storageService.loadAsResource(content.getStorageUrl());
        String contentType = storageService.getContentType(content.getStorageUrl());

        log.debug("Serving file for content ID: {}", id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    /**
     * Checks if content exists by ID.
     */
    @GetMapping("/{id}/exists")
    @Operation(summary = "Check if content exists", description = "Returns true if content with the given ID exists")
    public ResponseEntity<Boolean> contentExists(@PathVariable Long id) {

        boolean exists = contentService.existsById(id);
        log.info("Existence check for content ID {}: {}", id, exists);
        return ResponseEntity.ok(exists);
    }

    /**
     * Returns the total number of content items.
     */
    @GetMapping("/count")
    @Operation(summary = "Get total content count", description = "Returns the total number of content entries")
    public ResponseEntity<Long> countAllContent() {
        long count = contentService.countAllContent();
        log.info("Total content count retrieved: {}", count);
        return ResponseEntity.ok(count);
    }

    /**
     * Returns the number of content items by a specific creator.
     */
    @GetMapping("/count/creator/{creatorId}")
    @Operation(summary = "Get content count by creator", description = "Returns the number of content entries created by a specific user")
    public ResponseEntity<Long> countContentByCreator(
            @PathVariable Long creatorId) {

        long count = contentService.countContentByCreator(creatorId);
        log.info("Content count for creator ID {}: {}", creatorId, count);
        return ResponseEntity.ok(count);
    }

    // ========== Private Helper Methods ==========

    /**
     * Extracts user information from request headers and validates existence.
     *
     * @param request HTTP request
     * @return UserDTO if valid
     * @throws AccessDeniedException if user is not found or unauthorized
     */
    private UserDTO extractAndValidateUser(HttpServletRequest request) throws AccessDeniedException {
        String userId = request.getHeader(USER_ID_HEADER);
        if (userId == null || userId.trim().isEmpty()) {
            throw new AccessDeniedException("User ID header is missing or empty");
        }

        UserDTO user = userClient.getByUsername(userId);
        if (user == null) {
            throw new AccessDeniedException("User not found or unauthorized");
        }

        return user;
    }

    /**
     * Builds a ContentRequest object with the provided parameters.
     *
     * @param creatorId   ID of the content creator
     * @param accessLevel Access level for the content
     * @param title       Content title
     * @param description Content description
     * @param price       Content price
     * @return ContentRequest object
     */
    private ContentRequest buildContentRequest(Long creatorId, AccessLevel accessLevel,
                                               String title, String description, Double price, boolean active) {
        return ContentRequest.builder()
                .creatorId(creatorId)
                .accessLevel(accessLevel)
                .title(title)
                .description(description)
                .price(price)
                .active(active)
                .build();
    }

    /**
     * Logs content creation request details.
     *
     * @param contentRequest Content request details
     * @param file           Uploaded file (if any)
     */
    private void logContentCreationRequest(ContentRequest contentRequest, MultipartFile file) {
        log.debug("Creating content: {}", contentRequest);
        if (file != null) {
            log.debug("File attached: name={}, size={} bytes",
                    file.getOriginalFilename(), file.getSize());
        }
    }

    /**
     * Processes file upload and updates content entity accordingly.
     *
     * @param file    Uploaded file
     * @param content Content entity to update
     * @param title   Content title
     * @throws IOException if file processing fails
     */
    private void processFileUpload(MultipartFile file, Content content, String title) throws IOException {
        if (file != null && !file.isEmpty()) {
            // Set title from filename if not provided
            if ((title == null || title.trim().isEmpty()) && content.getTitle() == null) {
                content.setTitle(file.getOriginalFilename());
            }

            // Store file and update content
            String filename = storageService.store(file);
            if (content.getStorageUrl() != null && !content.getStorageUrl().equals(filename)) {
                storageService.delete(content.getStorageUrl());
            }
            content.setStorageUrl(filename);
            content.setContentType(ContentType.determineContentType(file.getContentType()));


            log.debug("File processed and stored: {}", filename);
        }
    }

    /**
     * Retrieves and maps creators by their IDs.
     *
     * @param creatorIds List of creator IDs
     * @return Map of creator ID to UserDTO
     */
    private Map<Long, UserDTO> getCreatorMap(List<Long> creatorIds) {
        List<UserDTO> creators = userClient.getUsersByIds(creatorIds);

        if (creators == null || creators.isEmpty()) {
            log.warn("No creators found for IDs: {}", creatorIds);
            return Collections.emptyMap();
        }

        return creators.stream()
                .collect(Collectors.toMap(UserDTO::getId, Function.identity()));
    }

    /**
     * Validates that the user owns the content.
     *
     * @param user    Current user
     * @param content Content to validate ownership
     * @throws AccessDeniedException if user doesn't own the content
     */
    private void validateContentOwnership(UserDTO user, Content content) throws AccessDeniedException {
        if (!Objects.equals(user.getId(), content.getCreatorId())) {
            throw new AccessDeniedException("You don't have permission to modify this content");
        }
    }

    /**
     * Updates content fields with provided values.
     *
     * @param content     Content entity to update
     * @param accessLevel New access level
     * @param title       New title
     * @param description New description
     * @param price       New price
     */
    private void updateContentFields(Content content, AccessLevel accessLevel,
                                     String title, String description, Double price, Boolean active) {

        if (title != null && !title.trim().isEmpty()) {
            content.setTitle(title.trim());
        }

        if (description != null) {
            content.setDescription(description.trim());
        }

        if (accessLevel != null) {
            content.setAccessLevel(accessLevel);
            updatePrice(content, accessLevel, price);
        } else if (price != null && price > 0 && AccessLevel.PAY_PER_VIEW.equals(content.getAccessLevel())) {
            content.setPrice(price);
        }

        if (active != null) {
            content.setActive(active);
        }
    }

    private void updatePrice(Content content, AccessLevel accessLevel, Double price) {
        if (AccessLevel.PAY_PER_VIEW.equals(accessLevel)) {
            if (price != null && price > 0) {
                content.setPrice(price);
            }
        } else {
            content.setPrice(null); // Clear price for non-paid content
        }
    }

}