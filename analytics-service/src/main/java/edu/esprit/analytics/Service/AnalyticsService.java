package edu.esprit.analytics.Service;

import edu.esprit.analytics.Repository.AnalyticsMetricRepository;
import lombok.RequiredArgsConstructor;
import edu.esprit.analytics.Model.AnalyticsMetric;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsMetricRepository repository;

    public List<AnalyticsMetric> getMetrics(String creatorId, LocalDateTime start, LocalDateTime end) {
        return repository.findByCreatorIdAndTimestampBetween(creatorId, start, end);
    }

    public List<AnalyticsMetric> getVideoMetrics(String videoId) {
        return repository.findByVideoId(videoId);
    }

    public AnalyticsMetric saveMetric(AnalyticsMetric metric) {
        return repository.save(metric);
    }
}
