package edu.esprit.analytics.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
    @Entity
    @Table(name = "analytics_metrics")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class AnalyticsMetric {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String videoId;
        private String creatorId;

        private int views;
        private int likes;
        private int comments;
        private int notifications;
        private int subscribers;

        private LocalDateTime timestamp;
    }
