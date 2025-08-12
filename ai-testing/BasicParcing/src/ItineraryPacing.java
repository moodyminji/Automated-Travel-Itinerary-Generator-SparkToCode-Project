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

    public static Pacing getPacingByTravelStyle(String travelStyle) {
        if ("relaxed".equalsIgnoreCase(travelStyle)) {
            return new Pacing(2, 4, 5, "Every 2-3 days");
        } else if ("balanced".equalsIgnoreCase(travelStyle)) {
            return new Pacing(3, 6, 7, "Every 4-5 days");
        } else if ("fast-paced".equalsIgnoreCase(travelStyle)) {
            return new Pacing(4, 8, 10, "Optional");
        } else {
            // default pacing
            return new Pacing(3, 6, 7, "Every 4-5 days");
        }
    }
}