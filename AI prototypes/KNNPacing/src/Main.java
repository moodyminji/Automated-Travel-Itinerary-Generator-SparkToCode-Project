import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String travelStyle = "";
        double budget = 0;
        int totalDays = 3;

        while (true) {
            System.out.println("Enter travel style (Relaxed, Balanced, Fast-Paced):");
            travelStyle = scanner.nextLine().trim();
            List<String> validStyles = Arrays.asList("relaxed", "balanced", "fast-paced");
            if (validStyles.contains(travelStyle.toLowerCase())) break;
            System.out.println("Invalid input. Try again.");
        }

        while (true) {
            System.out.println("Enter budget in $:");
            String input = scanner.nextLine().trim();
            try {
                budget = Double.parseDouble(input);
                if (budget <= 0) System.out.println("Budget must be positive.");
                else break;
            } catch (NumberFormatException e) {
                System.out.println("Invalid input.");
            }
        }

        System.out.println("Enter number of days (default 3):");
        String daysInput = scanner.nextLine().trim();
        if (!daysInput.isEmpty()) {
            try {
                int temp = Integer.parseInt(daysInput);
                if (temp > 0) totalDays = temp;
            } catch (NumberFormatException ignored) {}
        }

        // Generate itinerary
        List<List<ItineraryGenerator.Activity>> itinerary = ItineraryGenerator.generateItinerary(travelStyle, budget, totalDays);

        // Display it
        ItineraryGenerator.displayItinerary(itinerary, travelStyle);

        scanner.close();
    }
}
