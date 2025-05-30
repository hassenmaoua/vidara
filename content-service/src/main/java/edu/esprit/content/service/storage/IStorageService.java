package edu.esprit.content.service.storage;

import edu.esprit.content.exception.StorageFileNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Path;
import java.util.stream.Stream;


public interface IStorageService {
    String store(MultipartFile file) throws IOException;

    Stream<Path> loadAll();

    Path load(String filename);

    Resource loadAsResource(String filename) throws StorageFileNotFoundException;

    void delete(String filename) throws IOException;

    void init();
    String getContentType(String filename);

    long getFileSize(String filename) throws IOException;
}
