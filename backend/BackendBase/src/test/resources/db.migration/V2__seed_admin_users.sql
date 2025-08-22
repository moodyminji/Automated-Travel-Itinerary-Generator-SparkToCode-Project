INSERT INTO users (email, password_hash, preferences, created_at, updated_at)
VALUES
    ('admin1@tajawal.com', '$2a$10$Dow1pRL1vPR.UM6hOQPBBeJc2C8SbVG9gRh6kp92/5ANUPjYfnmze
', '{}', NOW(), NOW()),
    ('admin2@tajawal.com', '$2a$10$Dow1pRL1vPR.UM6hOQPBBeJc2C8SbVG9gRh6kp92/5ANUPjYfnmze
', '{}', NOW(), NOW()),
    ('admin3@tajawal.com', '$2a$10$Dow1pRL1vPR.UM6hOQPBBeJc2C8SbVG9gRh6kp92/5ANUPjYfnmze
', '{}', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS roles (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL UNIQUE
);

-- Insert ADMIN role
INSERT INTO roles (name) VALUES ('ADMIN')
ON CONFLICT (name) DO NOTHING;

-- User ↔ Role (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- Assign ADMIN role to the 3 admins
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u CROSS JOIN roles r
WHERE u.email IN ('admin1@tajawal.com', 'admin2@tajawal.com', 'admin3@tajawal.com')
  AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;
