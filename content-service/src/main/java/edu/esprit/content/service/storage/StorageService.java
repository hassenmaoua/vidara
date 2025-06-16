package edu.esprit.content.service.storage;

import edu.esprit.content.config.StorageProperties;
import edu.esprit.content.exception.StorageException;
import edu.esprit.content.exception.StorageFileNotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class StorageService implements IStorageService {
    private final Path rootLocation;
    private final StorageProperties properties;

    @Override
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    @Override
    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new StorageException("Failed to store empty file.");
        }

        // Validate file type
        if (!isAllowedType(file.getContentType())) {
            throw new StorageException("File type not allowed: " + file.getContentType());
        }

        // Validate file size


        String filename = generateFilename(file.getOriginalFilename());
        Path destinationFile = this.rootLocation.resolve(filename)
                .normalize().toAbsolutePath();

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }

        return filename;
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) throws StorageFileNotFoundException {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void delete(String filename) throws IOException {
        Path file = load(filename);
        Files.deleteIfExists(file);
    }

    @Override
    public String getContentType(String filename) {
        try {
            Path file = load(filename);
            return Files.probeContentType(file);
        } catch (IOException e) {
            throw new StorageException("Could not determine content type", e);
        }
    }

    @Override
    public long getFileSize(String filename) throws IOException {
        Path file = load(filename);
        return Files.size(file);
    }

    private boolean isAllowedType(String contentType) {
        if (contentType == null) return false;
        for (String allowed : properties.getAllowedTypes()) {
            if (contentType.equals(allowed)) {
                return true;
            }
        }
        return false;
    }

    private String generateFilename(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return System.currentTimeMillis() + "-" + UUID.randomUUID() + extension;
    }
}