public class Main {
    public static void main(String[] args) {
        String userTravelStyle = "fast-paced";

        ItineraryPacing.Pacing pacing = ItineraryPacing.getPacingByTravelStyle(userTravelStyle);

        System.out.println("Pacing rules for travel style '" + userTravelStyle + "':");
        System.out.println(pacing);
    }
}