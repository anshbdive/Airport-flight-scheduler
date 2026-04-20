package com.airport.flightscheduler.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    private String id;
    private String flightId;
    private String message;
    private String type; // e.g. "INFO", "WARNING", "URGENT"
    private LocalDateTime timestamp;
}
