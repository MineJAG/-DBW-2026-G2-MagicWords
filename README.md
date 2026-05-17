# -DBW-2026-G2-MagicWords
https://www.figma.com/design/aFBg3O3lc7Fb5b3d9u71rw/DBW-MagicWords?node-id=74-115&t=BaSs18qvGqWgpSyf-1
-----------------------------------------------------------
Sequence diagrams
https://www.figma.com/board/BYD78KXl7U1Rx9yM8sewWe/DBW?node-id=0-1&t=ZqWrWNu9FPK39pPW-1

-----------------------------------------------------------
## How to boot the site (guide)

**Requirements:** Node.js + a MongoDB instance.

**1. Install dependencies** (only the first time, or after pulling new deps):
```bash
npm install
```

**2. Create a `.env` file** at the project root with:
```
MONGODB_URI=<your mongodb connection string>
PORT=3000
COOKIE_SECRET=<any secret string>
```

**3. Start the backend** (Express + Socket.io on port 3000) — open one terminal:
```bash
node server.js
```

**4. Start the frontend** (Vite on port 5173) — open a second terminal:
```bash
npm run dev
```

Then open http://localhost:5173 in the browser. Use `Ctrl+C` in each terminal to stop.

