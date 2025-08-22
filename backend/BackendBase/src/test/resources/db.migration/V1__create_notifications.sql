-- Users table 
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(160)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    preferences   TEXT,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Helpful index for lookups by email 
CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users (email);

-- Notifications table 
CREATE TABLE IF NOT EXISTS notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    title       VARCHAR(160) NOT NULL,
    message     VARCHAR(1000) NOT NULL,
    read        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notifications_user
      FOREIGN KEY (user_id) REFERENCES users (id)
      ON DELETE CASCADE
);

-- Helpful indexes for common queries
CREATE INDEX IF NOT EXISTS ix_notifications_user   ON notifications (user_id);
CREATE INDEX IF NOT EXISTS ix_notifications_read   ON notifications (read);
CREATE INDEX IF NOT EXISTS ix_notifications_created ON notifications (created_at);
