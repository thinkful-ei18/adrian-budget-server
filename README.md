# Windfall Backend Server
Windfall is a simplified budgeting app that lets you create and maintain a list of bills. 

The back-end server was built with Express.js and deployed with Heroku using a PostgresQL database and knex.js for query building. I used Thinkful's back-end template. I also used DBeaver to create SQL scripts as an easy way to create seed data and Postman to test my endpoints. 

## Windfall Schemas & Endpoints
The API route consists of ```*API_BASE_URL*/api/xyz```. The database URL string needs to go in an .env file with a variable called ```DATABASE_URL```. It will be called in db-knex .js in the root folder.

You can POST new users at /users (id, firstname username, income), login with /login (username, password), and change a user's income at /users/income (income: Number, a protected endpoint!). On login, you will receive a JWT with a user's id, firstname username, income. User IDs start at 1.

``` sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  income smallint,
  created timestamp DEFAULT now()
);
```

Bill endpoints are protected and require a JWT which is decoded so the user's id can be used for queries. 
You can /GET bills, POST a single bill to /bills, delete a bill at /bills/:id, or modify a bill at PUT /bills/:id. ```title``` and ```amount``` are the only fields that are required.

Currently, the bill schema features a few unused fields that will be utilized when extension features are fleshed out. Bill IDs start at 1000.

``` sql
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
```

There are also categories, which will be used when extension features are done:

```sql
CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text NOT NULL UNIQUE
);

CREATE TABLE bills_categories (
  bill_id INTEGER NOT NULL REFERENCES bills ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories ON DELETE CASCADE
);
```

## Utilities
In /utils/ getUserId.js parses the userId from JWTs.

### Front-End Repo
The repo for the front-end can be found at: https://github.com/thinkful-ei18/adrian-budget-client. It is built with React JS, React Redux, and uses Redux forms. 

### Live App
The live app is deployed at http://adrian-budget-app.netlify.com/.
