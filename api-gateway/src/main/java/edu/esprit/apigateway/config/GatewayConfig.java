package edu.esprit.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final AuthenticationFilter authFilter;

    public GatewayConfig(AuthenticationFilter authFilter) {
        this.authFilter = authFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Authentication Service Routes (No auth required)
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("lb://authentication-service"))

                // User Service (Auth required)
                .route("user-service", r -> r
                        .path("/users/**")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://authentication-service"))

                // Public files Service Routes (No auth required)
                .route("content-service", r -> r
                        .path("/public/**")
                        .uri("lb://content-service"))

                // Content Service Routes (Auth required)
                .route("content-service", r -> r
                        .path("/contents/**")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://content-service"))

                .build();
    }
}
