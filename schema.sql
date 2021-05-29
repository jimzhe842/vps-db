CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar(20) NOT NULL UNIQUE,
  password varchar(20) NOT NULL
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