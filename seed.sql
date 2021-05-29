INSERT INTO users (username, password)
VALUES ('jelk', 'c21');

INSERT INTO portfolios (title, user_id)
VALUES ('stocks', 1);

INSERT INTO items (title, portfolio_id)
VALUES ('$ANVS', 1), ('$GME', 1);

UPDATE users set password = '$2b$10$uC3lSZqheRZja2B.jBA8q.2s3hkEviwTuRWdw36tngJBkm1i/Llo6'
WHERE id = 1