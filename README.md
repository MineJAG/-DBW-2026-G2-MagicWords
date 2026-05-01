# -DBW-2026-G2-MagicWords
https://www.figma.com/design/aFBg3O3lc7Fb5b3d9u71rw/DBW-MagicWords?node-id=74-115&t=BaSs18qvGqWgpSyf-1


```bash
    npm run dev // Dev is to run the site in development mode with vite
    npm run build // Build is to run the site on production mode to test the website
    npm run preview // Sanity check
    ctr+c //to stop
```

index.css:
text-container is currently being used for every box that is darker inside
game button is for the buttons with symbols inside only

navbar.css:
contains styles for the navbar

images.jsx:
is where we'll be putting every image for easier calling

----
imports
1º packages
2º hooks
3º context
4º components
5º styles
---------
## HTTP Status Codes

### Common codes used in this API

| Code | Name                  | When to use                                                   |
| ---- | --------------------- | ------------------------------------------------------------- |
| 200  | OK                    | Successful GET, or any success that returns data              |
| 201  | Created               | Successful POST that created a new resource                   |
| 204  | No Content            | Success but nothing to return (logout, delete)                |
| 400  | Bad Request           | Client sent invalid/malformed data (missing fields, bad format) |
| 401  | Unauthorized          | Not logged in / no valid session token                        |
| 403  | Forbidden             | Logged in, but not allowed to do this action                  |
| 404  | Not Found             | Resource doesn't exist (game ID, user, route)                 |
| 409  | Conflict              | Resource already exists (duplicate username/email)            |
| 500  | Internal Server Error | Something broke on the server (DB down, unexpected crash)     |

### Endpoint reference

| Endpoint                      | Code | Meaning                                        |
| ----------------------------- | ---- | ---------------------------------------------- |
| `POST /api/auth/register`     | 201  | User created                                   |
|                               | 400  | Missing or invalid fields                      |
|                               | 409  | Username or email already taken                |
|                               | 500  | Database error                                 |
| `POST /api/auth/login`        | 200  | Logged in (returns token/session)              |
|                               | 400  | Missing fields                                 |
|                               | 401  | Wrong username or password                     |
|                               | 500  | Database error                                 |
| `POST /api/games`             | 201  | Game created                                   |
|                               | 401  | Not logged in                                  |
|                               | 500  | Database error                                 |
| `GET /api/games/:id`          | 200  | Returns game state                             |
|                               | 401  | Not logged in                                  |
|                               | 403  | Game is private and user is not invited        |
|                               | 404  | No game with that ID                           |
| `POST /api/games/:id/word`    | 200  | Word submitted (response indicates if valid)   |
|                               | 400  | Empty word or wrong format                     |
|                               | 401  | Not logged in                                  |
|                               | 404  | Game doesn't exist                             |
|                               | 409  | Game has already ended                         |