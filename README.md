### Rodar backend

`cd server`

`npm i`

`npx prisma generate`

colocar variáveis no .env seguindo .env.example

```
  JWT_SECRET=super-secret-jwt
  DATABASE_URL=file:./prisma/dev.db
```

`npx prisma migrate dev`

`npm run dev`

================================================

### Rodar front end

`cd web`

`npm i`

colocar variáveis no .env seguindo .env.example

```
  VITE_BACKEND_URL=http://localhost:4000
```

`npm run dev`
