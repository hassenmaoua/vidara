package edu.esprit.analytics.Repository;

import edu.esprit.analytics.Model.AnalyticsMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AnalyticsMetricRepository extends JpaRepository<AnalyticsMetric, Long> {

    List<AnalyticsMetric> findByCreatorIdAndTimestampBetween(
            String creatorId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<AnalyticsMetric> findByVideoId(String videoId);
}