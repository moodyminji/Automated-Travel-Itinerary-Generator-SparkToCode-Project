export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="h1 mb-3">Plan your next trip in minutes</h1>
        <p className="small opacity-80 mb-6">
          Create an itinerary, set your budget, pick interests, and get a clean day-by-day plan.
        </p>
        <a href="/new-trip" className="btn-primary">Start New Trip</a>
      
        <a href="/auth" className="btn-secondary ml-3">Login</a>

      </div>

      {/* Replace with your exported illustration/image from Figma */}
      <div className="card p-0 overflow-hidden">
  <iframe
    title="Map"
    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31907288.869241536!2d44!3d23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v0000000000"
    className="w-full h-56 md:h-72"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    allowFullScreen
  />
</div>

    </section>
  );
}
