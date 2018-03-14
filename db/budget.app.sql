-- `psql -U dev -f ./db/budget.app.sql -d budget-app`

CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text NOT NULL UNIQUE
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  -- bill_id int REFERENCES bills ON DELETE SET NULL,
  fullname text NOT NULL,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  created timestamp DEFAULT now()
);

CREATE TABLE bills (
  id serial PRIMARY KEY,
  category_id int REFERENCES categories ON DELETE RESTRICT,
  user_id int REFERENCES users ON DELETE SET NULL,
  title text NOT NULL,
  amount number NOT NULL,
  created timestamp DEFAULT now()
);

CREATE TABLE bills_categories (
  bill_id INTEGER NOT NULL REFERENCES bills ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories ON DELETE CASCADE
);