// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* رسم ظريف بدل صورة خارجية */}
        <div className="mx-auto w-72 h-72 text-[--color-primary]">
          <svg viewBox="0 0 400 400" className="w-full h-full" role="img" aria-label="404 - page not found">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {/* 404 */}
            <g fill="none" stroke="currentColor" strokeWidth="10" opacity="0.25">
              <path d="M65 200 l60 -100 v160" />
              <path d="M145 260 h-80" />
              <circle cx="200" cy="200" r="46" />
              <circle cx="200" cy="200" r="86" />
              <path d="M315 200 l60 -100 v160" />
              <path d="M395 260 h-80" />
            </g>

            {/* سحابة */}
            <g fill="url(#g)" opacity="0.25">
              <ellipse cx="140" cy="120" rx="38" ry="22" />
              <ellipse cx="170" cy="120" rx="48" ry="28" />
              <ellipse cx="205" cy="120" rx="38" ry="22" />
            </g>

            {/* طيّارة */}
            <g transform="translate(60,30)">
              <path
                d="M60 220 l220 -40 c12 -2 20 12 11 21 l-55 54 c-3 3 -7 4 -11 3 l-70 -22 -42 24 -18 -6 26 -30 -58 -20 z"
                fill="currentColor"
                opacity="0.9"
              />
              <circle cx="263" cy="216" r="5" fill="white" />
            </g>
          </svg>
        </div>

        <h1 className="h2">Oops! Page not found</h1>
        <p className="text-muted max-w-md mx-auto">
          The page you’re looking for doesn’t exist or might have moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Back Home</Link>
          <Link to="/profile" className="btn-secondary">Go to My Trips</Link>
        </div>

        <p className="small text-muted">You can use the buttons above to get back on track.</p>
      </div>
    </section>
  );
}
