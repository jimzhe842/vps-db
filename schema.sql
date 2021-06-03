CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL
);

CREATE TABLE portfolios (
  id serial PRIMARY KEY,
  title text NOT NULL,
  user_id integer
    NOT NULL
    REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE TABLE items (
  id serial PRIMARY KEY,
  title text NOT NULL,
  portfolio_id integer
    NOT NULL
    REFERENCES portfolios (id)
    ON DELETE CASCADE
);

CREATE TABLE webhooks (
  id serial PRIMARY KEY,
  uuid text NOT NULL,
  created_at date NOT NULL,
  payloads jsonb,
  user_id integer
    NOT NULL
    REFERENCES users (id)
    ON DELETE CASCADE
);