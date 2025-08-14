public class ItineraryPacing {

    public static class Pacing {
        int maxActivitiesPerDay;
        int minTotalDurationHours;
        int maxTotalDurationHours;
        String restDayFrequency;

        public Pacing(int maxActivities, int minDuration, int maxDuration, String restFrequency) {
            this.maxActivitiesPerDay = maxActivities;
            this.minTotalDurationHours = minDuration;
            this.maxTotalDurationHours = maxDuration;
            this.restDayFrequency = restFrequency;
        }

        @Override
        public String toString() {
            return "Pacing{" +
                    "maxActivitiesPerDay=" + maxActivitiesPerDay +
                    ", minTotalDurationHours=" + minTotalDurationHours +
                    ", maxTotalDurationHours=" + maxTotalDurationHours +
                    ", restDayFrequency='" + restDayFrequency + '\'' +
                    '}';
        }
    }

    public static Pacing getPacingByStyleAndBudget(String travelStyle, double budget) {
        if ("relaxed".equalsIgnoreCase(travelStyle)) {
            if (budget < 500) {
                return new Pacing(1, 3, 4, "Every 2 days");
            } else if (budget < 1000) {
                return new Pacing(2, 4, 5, "Every 3 days");
            } else {
                return new Pacing(2, 4, 6, "Every 3-4 days");
            }
        } else if ("balanced".equalsIgnoreCase(travelStyle)) {
            if (budget < 800) {
                return new Pacing(2, 5, 6, "Every 3-4 days");
            } else if (budget < 1500) {
                return new Pacing(3, 6, 7, "Every 4-5 days");
            } else {
                return new Pacing(3, 6, 8, "Every 5 days");
            }
        } else if ("fast-paced".equalsIgnoreCase(travelStyle)) {
            if (budget < 1200) {
                return new Pacing(3, 6, 8, "Every 4 days");
            } else if (budget < 2500) {
                return new Pacing(4, 7, 9, "Every 5 days");
            } else {
                return new Pacing(5, 8, 10, "Optional");
            }
        } else {
            // Default pacing
            return new Pacing(3, 6, 7, "Every 4-5 days");
        }
    }
}
