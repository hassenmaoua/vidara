package edu.esprit.analytics.Controller;


import lombok.RequiredArgsConstructor;
import edu.esprit.analytics.Model.AnalyticsMetric;
import edu.esprit.analytics.Service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping("/overview")
    public List<AnalyticsMetric> getOverview(
            @RequestParam String creatorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return service.getMetrics(creatorId, start, end);
    }

    @GetMapping("/video/{videoId}")
    public List<AnalyticsMetric> getVideoMetrics(@PathVariable String videoId) {
        return service.getVideoMetrics(videoId);
    }

    @PostMapping
    public AnalyticsMetric saveMetric(@RequestBody AnalyticsMetric metric) {
        return service.saveMetric(metric);
    }
}
