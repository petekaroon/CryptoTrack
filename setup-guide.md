## Setup Guide

Steps for setting up in local development:

1. Create a postgreSQL database with schema from `./db/schema.sql`

2. Add a `.env` file to the project root folder with the following information
```
SESSION_SECRET=[Add your secret here]
JWT_TOKEN_SECRET=[Add your secret here]
DATABASE_URL="postgresql:[Add database location here]"
HOST="localhost"
PORT="8000"
```

3. Add a `.env` file to `./client` folder with the following information
```
FAST_REFRESH=false
PORT="3111"
```

4. At the `./client` folder, run command:
```
npm install
```

5. At the project root folder, run command:
```
npm install
```

6. To start the program, run command at the project root folder:
```
npm start
```