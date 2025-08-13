import java.util.*;

public class ItineraryGenerator {

    public static class Activity {
        String name;
        String type;
        String start;
        String duration; // format "2h", "1.5h"
        double cost;
        int score;
        double durationHours;

        public Activity(String name, String type, String start, String duration, double cost, int score) {
            this.name = name;
            this.type = type;
            this.start = start;
            this.duration = duration;
            this.cost = cost;
            this.score = score;
            this.durationHours = parseDuration(duration);
        }

        private double parseDuration(String duration) {
            if (duration.endsWith("h")) return Double.parseDouble(duration.replace("h", ""));
            return 0;
        }

        public String display() {
            return String.format("%s (%s) - Start: %s, Duration: %s, Cost: $%.2f", name, type, start, duration, cost);
        }
    }

    // Oman-based activities
    public static List<Activity> getActivities() {
        return Arrays.asList(
                new Activity("Sultan Qaboos Grand Mosque", "Culture", "09:00", "2h", 0, 3),
                new Activity("Mutrah Corniche Walk", "Sightseeing", "10:00", "1.5h", 0, 4),
                new Activity("Nizwa Fort Visit", "Culture", "08:30", "3h", 5, 5),
                new Activity("Wadi Shab Hike", "Adventure", "07:00", "5h", 10, 8),
                new Activity("Al Mouj Marina Relax", "Relaxation", "15:00", "2h", 0, 6),
                new Activity("Royal Opera House Tour", "Culture", "11:00", "2h", 15, 7),
                new Activity("Beach at Bandar Khayran", "Adventure", "12:00", "3h", 5, 7),
                new Activity("Shopping at Mutrah Souq", "Shopping", "14:00", "2h", 20, 5),
                new Activity("Kayaking in Wadi Al Arbeieen", "Adventure", "08:00", "4h", 25, 9),
                new Activity("Cooking Omani Cuisine Class", "Food", "10:00", "3h", 30, 6)
        );
    }

    // Max activities per day
    private static Map<String, Integer> maxActivitiesMap = Map.of(
            "relaxed", 2,
            "balanced", 3,
            "fast-paced", 4
    );

    // Total duration limits per day
    private static Map<String, Double[]> durationLimitsMap = Map.of(
            "relaxed", new Double[]{4.0, 5.0},
            "balanced", new Double[]{6.0, 7.0},
            "fast-paced", new Double[]{8.0, 10.0}
    );

    public static int calculateUserScore(String travelStyle, double budget) {
        int score = 0;
        List<String> validStyles = Arrays.asList("relaxed", "balanced", "fast-paced");
        if (!validStyles.contains(travelStyle.toLowerCase())) {
            travelStyle = "balanced";
        }

        switch (travelStyle.toLowerCase()) {
            case "relaxed": score += 3; break;
            case "balanced": score += 5; break;
            case "fast-paced": score += 8; break;
        }

        double minBudget = 100;
        double maxBudget = 5000;
        if (budget < minBudget) budget = minBudget;
        if (budget > maxBudget) {
            System.out.println("Budget exceeds maximum. Setting to $" + maxBudget);
            budget = maxBudget;
        }

        double normalizedBudget = ((budget - minBudget) / (maxBudget - minBudget)) * 10;
        int budgetScore = (int) Math.round(normalizedBudget);

        score += budgetScore;
        return Math.max(1, Math.min(score, 10));
    }

    // Select activities for a day respecting max activities and duration
    public static List<Activity> selectActivitiesForDay(List<Activity> activities, int userScore, String travelStyle) {
        activities.sort(Comparator.comparingInt(a -> Math.abs(a.score - userScore)));

        int maxActivities = maxActivitiesMap.get(travelStyle.toLowerCase());
        Double[] durationLimit = durationLimitsMap.get(travelStyle.toLowerCase());
        double maxDuration = durationLimit[1];

        List<Activity> dayActivities = new ArrayList<>();
        double totalDuration = 0;

        Iterator<Activity> iterator = activities.iterator();
        while (iterator.hasNext() && dayActivities.size() < maxActivities) {
            Activity act = iterator.next();
            if (totalDuration + act.durationHours <= maxDuration) {
                dayActivities.add(act);
                totalDuration += act.durationHours;
                iterator.remove();
            }
        }

        return dayActivities;
    }

    // Generate full itinerary for multiple days
    public static List<List<Activity>> generateItinerary(String travelStyle, double budget, int days) {
        if (days <= 0) throw new IllegalArgumentException("Number of days must be at least 1.");

        int userScore = calculateUserScore(travelStyle, budget);
        List<Activity> allActivities = new ArrayList<>(getActivities());
        List<List<Activity>> itinerary = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            if (allActivities.isEmpty()) {
                allActivities = new ArrayList<>(getActivities()); // reuse if not enough activities
            }

            List<Activity> dayActs = selectActivitiesForDay(allActivities, userScore, travelStyle);
            itinerary.add(dayActs);
        }

        return itinerary;
    }

    // Display itinerary
    public static void displayItinerary(List<List<Activity>> itinerary, String travelStyle) {
        Map<String, Integer> maxActivitiesMap = Map.of(
                "relaxed", 2,
                "balanced", 3,
                "fast-paced", 4
        );

        int dayNum = 1;
        for (List<Activity> dayActs : itinerary) {
            // Insert rest days
            if (travelStyle.equalsIgnoreCase("relaxed") && dayNum % 3 == 0) {
                System.out.println("\nDay " + dayNum + ": Rest Day 🛌");
                dayNum++;
            } else if (travelStyle.equalsIgnoreCase("balanced") && dayNum % 5 == 0) {
                System.out.println("\nDay " + dayNum + ": Rest Day 🛌");
                dayNum++;
            }

            System.out.println("\nDay " + dayNum + ":");
            for (Activity act : dayActs) {
                System.out.println("- " + act.display());
            }
            dayNum++;
        }
    }
}
