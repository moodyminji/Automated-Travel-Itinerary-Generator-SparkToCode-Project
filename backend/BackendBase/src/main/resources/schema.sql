-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    preferences JSONB DEFAULT '{}',
    travel_style VARCHAR(50),
    email_verified BOOLEAN DEFAULT false
);

-- Trips Table
CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(120) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_amount NUMERIC(12,3) DEFAULT 0,
    budget_breakdown JSONB DEFAULT '{}',
    travel_style VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Itinerary Days Table
CREATE TABLE itinerary_days (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uk_trip_day UNIQUE (trip_id, day_number)
);

-- Activities Table
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    itinerary_day_id BIGINT NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    position INT DEFAULT 1,
    name VARCHAR(160) NOT NULL,
    location VARCHAR(160),
    cost_amount NUMERIC(12,3) DEFAULT 0,
    cost_currency VARCHAR(3) NOT NULL DEFAULT 'OMR',
    start_time TIME,
    duration_minutes INT DEFAULT 0,
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Notifications Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message VARCHAR(255) NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Log Entries Table
CREATE TABLE log_entries (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100),
    user_email VARCHAR(160)
);