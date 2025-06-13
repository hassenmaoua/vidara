package edu.esprit.content;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
@ConfigurationPropertiesScan("edu.esprit.content.config")
public class ContentApplication {

    public static void main(String[] args) {
        SpringApplication.run(ContentApplication.class, args);
    }

}
