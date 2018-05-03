INSERT into categories (title) VALUES
('Housing'), ('Childcare'), ('Food'), ('Healthcare'), ('Utilities'),('Auto'), ('Auto-pay'), ('Entertainment');

INSERT into users (id, firstname, username, password) VALUES
(1, 'dev user', 'dev', '0320');

INSERT into bills (category_id, user_id, name, amount) VALUES
(100, 1, 'Internet', '65'), (102, 1, 'Groceries', '250'), (105, 1, 'Utilities', '350'), (100, 1, 'Rent', '1250'), (106, 1, 'Cellphone', '300'), (107, 1, 'Netflix', '15'), (107, 1, 'Spotify', '15');

INSERT into bills_categories (bill_id, category_id) VALUES
(1000, 100), (1001, 102), (1002, 105), (1003, 100), (1004, 106), (1005, 107), (1006, 107);