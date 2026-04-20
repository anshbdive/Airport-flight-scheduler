package com.airport.flightscheduler.service;

import com.airport.flightscheduler.model.Flight;
import com.airport.flightscheduler.model.Passenger;
import com.airport.flightscheduler.model.Route;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.UUID;

@Service
public class FlightService {

    // 1. HashMap for fast flight lookup by flightId
    private final Map<String, Flight> flightMap = new HashMap<>();

    // 2. PriorityQueue (Heap) for flight scheduling
    private final PriorityQueue<Flight> flightQueue = new PriorityQueue<>();

    // 3. LinkedList/Queue for delayed/waiting flights
    private final Queue<Flight> delayedFlights = new LinkedList<>();

    // 4. Graph (Adjacency List) for airport connections
    private final Map<String, List<Route>> airportGraph = new HashMap<>();

    // 5. List for Passenger Bookings
    private final List<Passenger> bookings = new ArrayList<>();

    @Autowired
    private NotificationService notificationService;

    public FlightService() {
        // Initialize graph with some default routes (times in minutes)
        // US Routes
        addRoute("JFK", "LAX", 360);
        addRoute("JFK", "ORD", 150);
        addRoute("ORD", "LAX", 240);
        addRoute("LAX", "SFO", 90);
        addRoute("ORD", "DFW", 140);
        addRoute("DFW", "LAX", 190);
        addRoute("JFK", "MIA", 180);
        addRoute("MIA", "DFW", 170);

        // Indian Routes
        addRoute("DEL", "BOM", 130);
        addRoute("DEL", "BLR", 160);
        addRoute("DEL", "CCU", 130);
        addRoute("DEL", "HYD", 140);
        addRoute("DEL", "AMD", 90);
        addRoute("BOM", "BLR", 100);
        addRoute("BOM", "HYD", 85);
        addRoute("BOM", "AMD", 70);
        addRoute("BOM", "PNQ", 45);
        addRoute("BOM", "GOI", 75);
        addRoute("BLR", "HYD", 70);
        addRoute("BLR", "MAA", 60);
        addRoute("BLR", "COK", 65);
        addRoute("MAA", "CCU", 140);
        addRoute("MAA", "HYD", 75);
        addRoute("CCU", "HYD", 125);
    }

    private void addRoute(String source, String dest, int weight) {
        airportGraph.putIfAbsent(source, new ArrayList<>());
        airportGraph.get(source).add(new Route(dest, weight));
        
        airportGraph.putIfAbsent(dest, new ArrayList<>());
        airportGraph.get(dest).add(new Route(source, weight));
    }

    public Flight scheduleFlight(Flight flight) {
        if (flight.getStatus() == null) {
            flight.setStatus("ON_TIME");
        }
        flightMap.put(flight.getFlightId(), flight);
        
        if ("DELAYED".equals(flight.getStatus())) {
            delayedFlights.offer(flight);
        } else {
            flightQueue.offer(flight);
        }
        return flight;
    }

    public Flight getFlightById(String flightId) {
        return flightMap.get(flightId);
    }

    public List<Flight> getAllFlights() {
        return new ArrayList<>(flightMap.values());
    }

    public Flight handleDelay(String flightId, int newPriority) {
        Flight flight = flightMap.get(flightId);
        if (flight != null) {
            flight.setStatus("DELAYED");
            flight.setPriority(newPriority);
            
            flightQueue.remove(flight);
            
            if (!delayedFlights.contains(flight)) {
                delayedFlights.offer(flight);
            }
            notificationService.addNotification(flightId, "Flight " + flightId + " delayed due to priority adjustment.", "WARNING");
        }
        return flight;
    }

    public Flight updateFlightStatus(String flightId, String status) {
        Flight flight = flightMap.get(flightId);
        if (flight != null) {
            flight.setStatus(status);
            if ("COMPLETED".equals(status) || "CANCELLED".equals(status)) {
                flightQueue.remove(flight);
                delayedFlights.remove(flight);
            } else if ("ON_TIME".equals(status)) {
                delayedFlights.remove(flight);
                if (!flightQueue.contains(flight)) {
                    flightQueue.offer(flight);
                }
            } else if ("DELAYED".equals(status)) {
                flightQueue.remove(flight);
                if (!delayedFlights.contains(flight)) {
                    delayedFlights.offer(flight);
                }
                notificationService.addNotification(flightId, "Flight " + flightId + " is now DELAYED.", "WARNING");
            } else if ("CANCELLED".equals(status)) {
                notificationService.addNotification(flightId, "Flight " + flightId + " has been CANCELLED.", "URGENT");
            } else if ("ON_TIME".equals(status)) {
                notificationService.addNotification(flightId, "Flight " + flightId + " is back ON TIME.", "INFO");
            }
        }
        return flight;
    }

    // Dijkstra's Algorithm
    public Map<String, Object> getShortestRoute(String source, String destination) {
        Map<String, Integer> distances = new HashMap<>();
        Map<String, String> previous = new HashMap<>();
        PriorityQueue<Route> minHeap = new PriorityQueue<>(Comparator.comparingInt(Route::getWeight));

        for (String node : airportGraph.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
        }
        distances.put(source, 0);
        minHeap.offer(new Route(source, 0));

        while (!minHeap.isEmpty()) {
            Route current = minHeap.poll();
            String currentAirport = current.getDestination();

            if (currentAirport.equals(destination)) {
                break;
            }

            if (current.getWeight() > distances.getOrDefault(currentAirport, Integer.MAX_VALUE)) {
                continue;
            }

            List<Route> neighbors = airportGraph.getOrDefault(currentAirport, new ArrayList<>());
            for (Route neighbor : neighbors) {
                int newDist = distances.get(currentAirport) + neighbor.getWeight();
                if (newDist < distances.getOrDefault(neighbor.getDestination(), Integer.MAX_VALUE)) {
                    distances.put(neighbor.getDestination(), newDist);
                    previous.put(neighbor.getDestination(), currentAirport);
                    minHeap.offer(new Route(neighbor.getDestination(), newDist));
                }
            }
        }

        List<String> path = new ArrayList<>();
        String curr = destination;
        if (previous.containsKey(curr) || curr.equals(source)) {
            while (curr != null) {
                path.add(0, curr);
                curr = previous.get(curr);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("path", path);
        result.put("totalWeight", distances.getOrDefault(destination, -1));
        return result;
    }

    // Booking Logic
    public Passenger bookFlight(Passenger passenger) {
        passenger.setBookingId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        passenger.setBookingTime(LocalDateTime.now());
        bookings.add(passenger);
        return passenger;
    }

    public List<Passenger> getAllBookings() {
        return bookings;
    }
}
