-- `psql -U dev -f ./db/budget.app.sql -d dev-budget-app`
-- `psql -U dev -f ./db/manual-seed.sql -d dev-budget-app`

-- `psql -U dev -f ./db/budget.app.sql -d test-budget-app`
-- `psql -U dev -f ./db/manual-seed.sql -d test-budget-app`

DROP TABLE IF EXISTS bills_categories;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;


CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text NOT NULL UNIQUE
);

ALTER SEQUENCE categories_id_seq RESTART WITH 100;

CREATE TABLE users (
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  income smallint,
  created timestamp DEFAULT now()
);

CREATE TABLE bills (
  id serial PRIMARY KEY,
  category_id int REFERENCES categories ON DELETE RESTRICT,
  user_id int REFERENCES users ON DELETE RESTRICT,
  name text NOT NULL,
  amount smallint NOT NULL,
  beenpaid boolean,
  duedate date,
  billinterval interval,
  created timestamp DEFAULT now()
);

ALTER SEQUENCE bills_id_seq RESTART WITH 1000;

CREATE TABLE bills_categories (
  bill_id INTEGER NOT NULL REFERENCES bills ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories ON DELETE CASCADE
);