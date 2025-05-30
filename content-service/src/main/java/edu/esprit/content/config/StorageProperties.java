package edu.esprit.content.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "storage")
@Getter
@Setter
public class StorageProperties {
    String location;
    String baseUrl;
    long maxFileSize;
    String[] allowedTypes;
}

