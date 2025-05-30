package edu.esprit.content.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.TimeZone;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    @Bean
    public Path rootLocation(StorageProperties properties) {
        return Paths.get(properties.getLocation()).toAbsolutePath().normalize();
    }
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            builder.serializers(new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));
            builder.deserializers(new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
            builder.simpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            builder.timeZone(TimeZone.getDefault());
        };
    }


//    @Bean
//    public IStorageService storageService(StorageProperties properties) {
//        return new StorageService(properties) {
//            @Override
//            public Path load(String filename) {
//                Path file = super.load(filename);
//                try {
//                    if (!file.normalize().startsWith(rootLocation(properties))) {
//                        throw new StorageException("Cannot access file outside storage directory");
//                    }
//                    return file;
//                } catch (Exception e) {
//                    throw new StorageException("Invalid file path", e);
//                }
//            }
//        };
//    }
}