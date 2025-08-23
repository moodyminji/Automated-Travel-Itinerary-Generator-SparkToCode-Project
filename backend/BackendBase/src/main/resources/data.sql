-- =========================
-- USERS (Admins + Demo)
-- =========================
-- Admin password: Admin@123 (bcrypt, different salts)
INSERT INTO users (email, password_hash, email_verified)
VALUES
 ('admin1@tajawal.com', '$2b$10$.vTlOy8Dc0urv21NreFbi.FV/BPoUoulfOnkypM7f03rIeRLhXyoC', TRUE),
 ('admin2@tajawal.com', '$2b$10$TK5j1wmYuHq3CgkSFmcva.zTVpv6JIpAhOstkivh4Pa76OZrKCzTC', TRUE),
 ('admin3@tajawal.com', '$2b$10$3YTHqa0XnllvSkC5wLEjv.fMasU/dOURpFohgb1iqetWfV.a59K.i', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Demo user: user@demo.com / demo123
INSERT INTO users (email, password_hash, preferences, email_verified, travel_style)
VALUES ('user@demo.com', '$2b$10$GLp2uy92/0NR95bGvCthB.uQvPPrj8cE7N/oI6qfVHzE3b/SLNqzq',
        '{"interests":["food","shopping"]}', TRUE, 'comfort')
ON CONFLICT (email) DO NOTHING;


-- =========================
-- SAMPLE TRIP for Demo User
-- =========================
-- Trip (Dubai, with budget + breakdown)
INSERT INTO trips (user_id, destination, start_date, end_date, budget_amount, budget_breakdown, travel_style)
SELECT u.id, 'Dubai', DATE '2025-09-10', DATE '2025-09-15', 1000.000,
       '{"accommodation":400,"flights":220,"activities":230,"food":120,"misc":30}'::jsonb,
       'comfort'
FROM users u
WHERE u.email = 'user@demo.com'
  AND NOT EXISTS (
      SELECT 1 FROM trips t
      WHERE t.user_id = u.id AND t.destination = 'Dubai' AND t.start_date = DATE '2025-09-10'
  );

-- Day 1
WITH trip_row AS (
  SELECT t.id AS trip_id
  FROM trips t
  JOIN users u ON u.id = t.user_id
  WHERE u.email = 'user@demo.com' AND t.destination = 'Dubai' AND t.start_date = DATE '2025-09-10'
  ORDER BY t.id DESC LIMIT 1
)
INSERT INTO itinerary_days (trip_id, day_number)
SELECT trip_id, 1 FROM trip_row
WHERE NOT EXISTS (
  SELECT 1 FROM itinerary_days d WHERE d.trip_id = (SELECT trip_id FROM trip_row) AND d.day_number = 1
);

-- Activities for Day 1
WITH day_row AS (
  SELECT d.id AS day_id
  FROM itinerary_days d
  JOIN trips t ON t.id = d.trip_id
  JOIN users u ON u.id = t.user_id
  WHERE u.email = 'user@demo.com' AND t.destination = 'Dubai' AND d.day_number = 1
  ORDER BY d.id DESC LIMIT 1
)
INSERT INTO activities (itinerary_day_id, position, name, location, cost_amount, cost_currency, start_time, duration_minutes, notes)
SELECT day_id, 1, 'Welcome walk + local highlights', 'Dubai', 0, 'OMR', TIME '10:00', 90, 'AI-balanced seed activity'
FROM day_row
WHERE NOT EXISTS (
  SELECT 1 FROM activities a WHERE a.itinerary_day_id = (SELECT day_id FROM day_row) AND a.position = 1
);

-- =========================
-- NOTIFICATIONS
-- =========================
INSERT INTO notifications (user_id, message, read)
SELECT u.id, 'Your itinerary is ready!', FALSE
FROM users u
WHERE u.email = 'user@demo.com'
  AND NOT EXISTS (
      SELECT 1 FROM notifications n WHERE n.user_id = u.id AND n.message = 'Your itinerary is ready!'
  );


-- =========================
-- LOG ENTRIES (Admin Dashboard)
-- =========================
INSERT INTO log_entries (level, message, source, user_email)
VALUES 
 ('INFO',   'User login successfully',         'System', 'user@demo.com'),
 ('WARNING','High memory usage detected',      'System', NULL),
 ('ERROR',  'Database connection timeout',     'System', NULL),
 ('INFO',   'Itinerary generation completed',  'API',    'user@demo.com')
ON CONFLICT DO NOTHING;