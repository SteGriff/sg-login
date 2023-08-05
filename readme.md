# sg-login

I'm making a reusable boilerplate for myself to use as the basis for Express apps with authentication.

## Tech

- ES Modules
- Node 18
- Nunjucks
- Better-Sqlite3
- Express Sessions
- Try to do some best practices like salt and stuff

## Concepts

- `npm run migrations` to run first time DB setup scripts
- Server-side pages with progressive enhancement using petite-vue, generally.

## Data Schema

### Users

Salt is 200 chars to accomodate 128 bytes to base64 (should be 172 chars)

## Sqlite3

Each column in an SQLite 3 database is assigned one of the following type affinities:

- TEXT
- NUMERIC
- INTEGER
- REAL
- BLOB

<https://www.sqlite.org/datatype3.html>
