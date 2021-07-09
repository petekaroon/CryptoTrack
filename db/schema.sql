CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar(100) NOT NULL UNIQUE,
  password varchar(100) NOT NULL
);

CREATE TABLE cryptos (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  symbol text NOT NULL UNIQUE
);

CREATE TABLE transactions (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  crypto_id integer NOT NULL REFERENCES cryptos (id) ON DELETE CASCADE,
  buy_tx boolean NOT NULL,
  qty decimal(26,10) NOT NULL,
  unit_price decimal(20,10) NOT NULL,
  date timestamptz NOT NULL DEFAULT NOW(),
  tx_value decimal(26,6) NOT NULL,
);