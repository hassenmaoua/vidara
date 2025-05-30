package edu.esprit.content.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import edu.esprit.content.dto.ContentDTO;
import edu.esprit.content.dto.requests.ContentRequest;
import edu.esprit.content.entity.Content;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import edu.esprit.content.service.content.ContentService;
import edu.esprit.content.service.storage.StorageService;
import edu.esprit.content.utils.ContentMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.List;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("contents")
@Tag(name = "Contents", description = "Web Services for Content Management")
public class ContentController {
    private final ContentService contentService;
    private final StorageService storageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create new content with optional file")
    public ResponseEntity<Object> createContentWithFile(
            @RequestParam("accessLevel") AccessLevel accessLevel,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {

            ContentRequest contentRequest = ContentRequest.builder()
                    .creatorId(0L)
                    .accessLevel(accessLevel)
                    .title(title)
                    .description(description)
                    .price(price)
                    .build();

            log.debug("Received content: {}", contentRequest);
            if (file != null) {
                log.debug("Received file: {}, , size: {}", file.getOriginalFilename(), file.getSize());
            }

            Content content = ContentMapper.toContent(contentRequest);

            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String filename = storageService.store(file);
                content.setStorageUrl(filename);
                content.setContentType(ContentType.determineContentType(file.getContentType()));
            }

            Content savedContent = contentService.createContent(content);
            return ResponseEntity.ok(ContentMapper.toDto(savedContent));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("File storage error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Server error: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    @Operation(summary = "Get content by ID")
    public ResponseEntity<ContentDTO> getContent(@PathVariable Long id) {
        var content = contentService.getContentById(id);
        return ResponseEntity.ok(ContentMapper.toDto(content));
    }

    @GetMapping
    @Operation(summary = "Get all content")
    public ResponseEntity<List<Content>> getAllContent() {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "Get content by creator ID")
    public ResponseEntity<List<Content>> getContentByCreator(@PathVariable Long creatorId) {
        return ResponseEntity.ok(contentService.getContentByCreator(creatorId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update content")
    public ResponseEntity<Content> updateContent(@PathVariable Long id, @RequestBody ContentRequest contentDetails) {
        return ResponseEntity.ok(contentService.updateContent(id, contentDetails));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete content")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/publish")
    @Operation(summary = "Publish content")
    public ResponseEntity<Content> publishContent(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.publishContent(id));
    }

    @PutMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish content")
    public ResponseEntity<Content> unpublishContent(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.unpublishContent(id));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getContentFile(@PathVariable Long id) {
        Content content = contentService.getContentById(id);
        if (content.getStorageUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Resource file = storageService.loadAsResource(content.getStorageUrl());
            String contentType = storageService.getContentType(content.getStorageUrl());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
