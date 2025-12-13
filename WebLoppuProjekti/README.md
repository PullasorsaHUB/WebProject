# Reseptisovellus

Full-stack reseptisovellus React + Node.js + PostgreSQL

## Käynnistysohjeet

### 1. Backend setup

Siirry backend-kansioon ja asenna paketit:

```bash
cd backend
npm install
```

Varmista että PostgreSQL on käynnissä ja luo `.env` tiedosto:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/recipes_db"
JWT_SECRET="your-secret-key"
```

Päivitä tietokanta skeemaan ja generoi Prisma client:

```bash
npx prisma db push
npx prisma generate
```

Aja testidatan luonti (valinnainen):

```bash
npx ts-node prisma/script.ts
```

Käynnistä backend-palvelin:

```bash
npm run dev
```

Backend on osoitteessa `http://localhost:3000`.

### 2. Frontend setup

Siirry frontend-kansioon ja asenna paketit:

```bash
cd frontend
npm install
```

Käynnistä kehityspalvelin:

```bash
npm run dev
```

Frontend on osoitteessa `http://localhost:5173`.

## Ominaisuudet

- ✅ Reseptien listaus ja haku
- ✅ Reseptien luominen, muokkaus ja poisto
- ✅ Käyttäjärekisteröinti ja kirjautuminen (käyttäjänimi tuki)
- ✅ Suosikkireseptien hallinta (Context API)
- ✅ Klikattavat reseptikuvat navigointia varten
- ✅ Reseptin tekijän näyttäminen
- ✅ Responsiivinen käyttöliittymä (DaisyUI + Tailwind)

## Teknologiat

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express, TypeScript
- **Tietokanta**: PostgreSQL, Prisma ORM
- **Autentikointi**: JWT, bcrypt

## Prisma-komennot

Kehittäjätyökalut tietokantahallintaa varten:

```bash
# Prisma Client uudelleengenerointi (tehtävä schema-muutosten jälkeen)
npx prisma generate

# Tietokannan päivitys skeemaan
npx prisma db push

# Seed-skriptin ajaminen
npx ts-node prisma/script.ts

# Prisma Studio avaaminen (tietokannan GUI)
npx prisma studio
```
