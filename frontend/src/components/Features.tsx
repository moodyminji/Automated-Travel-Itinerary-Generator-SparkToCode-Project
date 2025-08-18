import FeatureCard from './FeatureCard';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PaidIcon from '@mui/icons-material/Paid';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export default function Features() {
  return (
    <section className="mt-10">
      <div className="grid md:grid-cols-3 gap-4">
        <FeatureCard
          title="Smart Itineraries"
          body="AI-assisted, day-by-day plans tailored to your preferences."
          icon={<FlightTakeoffIcon fontSize="large" />}
        />
        <FeatureCard
          title="Budget Aware"
          body="Stay on budget with clear cost hints and options."
          icon={<PaidIcon fontSize="large" />}
        />
        <FeatureCard
          title="Lightning Fast"
          body="Plan trips in minutes with a clean, focused UI."
          icon={<FlashOnIcon fontSize="large" />}
        />
      </div>
    </section>
  );
}
