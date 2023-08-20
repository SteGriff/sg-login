# sg-login

I'm making a reusable boilerplate for myself to use as the basis for Express apps with authentication.

## Tech

- ES Modules
- Node 18
- Nunjucks
- Better-Sqlite3
- Express Sessions
- Try to do some best practices like salt and stuff
- zxcvbn for password strength

## Concepts

- `npm run migrations` to run first time DB setup scripts
- Server-side pages with progressive enhancement using petite-vue, generally.

## Usage

The base system provides the following pages:

- Index (`/`)
- Login (`/login`)
- Register (`/register`)

There are two usage styles:

1.  POST-Redirect-GET (PRG)
2.  JSON API

### 1. PRG

POST to the `/login`, `/logout`, or `/register` routes with Form Data (see example Login page). On success, you will be redirected to index with the Session User set. On failure, you'll stay on the page and the model will be a common result type with a `status` and `message` or `model`.

### 2. JSON

POST with form data or JSON data to the `/api/login`, `/api/logout`, or `/api/register` endpoints with e.g. `{"username":"Ste","password":"Test"}`.

```js
await fetch("/api/login", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username: "Ste", password: "Test" }),
});
```

Registration also accepts an optional `email` parameter (make this mandatory if you want).

You will receive a JSON response like:

```json
{
  "status": "OK",
  "model": {
    "ID": 1,
    "Username": "Ste",
    "Email": "ste@example.org"
  }
}
```

For failed registration, the response will have a `message` field, and the `model` field will be the complete result object from zxcvbn.

Successful registration logs you in immediately.

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
