-- `psql -U dev -f ./db/budget.app.sql -d budget-app`

CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text NOT NULL UNIQUE
);

ALTER SEQUENCE categories_id_seq RESTART WITH 100;

CREATE TABLE users (
  id serial PRIMARY KEY,
  fullname text NOT NULL,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  created timestamp DEFAULT now()
);

CREATE TABLE bills (
  id serial PRIMARY KEY,
  category_id int REFERENCES categories ON DELETE RESTRICT,
  user_id int REFERENCES users ON DELETE SET NULL,
  name text NOT NULL,
  amount number NOT NULL,
  created timestamp DEFAULT now()
);

ALTER SEQUENCE bills_id_seq RESTART WITH 1000;

CREATE TABLE bills_categories (
  bill_id INTEGER NOT NULL REFERENCES bills ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories ON DELETE CASCADE
);