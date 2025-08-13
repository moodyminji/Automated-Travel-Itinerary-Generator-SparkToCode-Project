public class Main {
    public static void main(String[] args) {
        String travelStyle = "balanced";
        double userBudget = 1200;

        ItineraryPacing.Pacing pacing = ItineraryPacing.getPacingByStyleAndBudget(travelStyle, userBudget);

        System.out.println("Pacing rules for travel style '" + travelStyle +
                "' and budget $" + userBudget + ":");
        System.out.println(pacing);
    }
}