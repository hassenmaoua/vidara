package edu.esprit.content.controller;

import edu.esprit.content.service.content.ContentService;
import edu.esprit.content.service.storage.IStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/content/files")
@RequiredArgsConstructor
@Tag(name = "File Storage", description = "API for file upload/download")
public class FileStorageController {
    private final IStorageService storageService;
    private final ContentService contentService;

    @PostMapping("/upload")
    @Operation(summary = "Upload a file")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filename = storageService.store(file);
            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Resource file = storageService.loadAsResource(filename);
            String contentType = storageService.getContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{filename:.+}")
    @Operation(summary = "Delete a file")
    public ResponseEntity<Void> deleteFile(@PathVariable String filename) {
        try {
            storageService.delete(filename);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}