# SimpleChef - Reseptisovellus

SimpleChef on moderni reseptien jakamiseen tarkoitettu web-sovellus, jossa käyttäjät voivat rekisteröityä, kirjautua sisään, luoda omia reseptejä, selata muiden reseptejä sekä merkitä mieluisimmat suosikeikseen. Sovellus on rakennettu täysin TypeScriptillä käyttäen nykyaikaisia web-teknologioita.

## Käytetyt teknologiat

### Frontend
- **React 18** - Käyttöliittymäkirjasto
- **TypeScript** - Tyypitetty JavaScript
- **Vite** - Kehityspalvelin ja bundleri
- **React Router** - Reititys
- **Tailwind CSS** - Utility-first CSS-framework
- **DaisyUI** - Tailwind-pohjaiset UI-komponentit

### Backend
- **Node.js** - JavaScript-ajoympäristö
- **Express.js** - Web-sovelluskehys
- **TypeScript** - Tyypitetty JavaScript
- **Prisma ORM** - Tietokanta-abstraktio
- **Swagger** - API-dokumentaatio
- **JWT (jsonwebtoken)** - Token-pohjainen autentikointi
- **bcrypt** - Salasanojen tiivistys

### Tietokanta
- **PostgreSQL** - Relaatiotietokanta

## Asennusohjeet

### Esivaatimukset
- Node.js (versio 18 tai uudempi)
- PostgreSQL-tietokanta
- npm tai yarn

### Tietokannan asennus
1. Asenna PostgreSQL tietokanta
2. Luo tietokanta nimeltä `simplechef`:
   ```sql
   CREATE DATABASE simplechef;
   ```

### Backend-asennus

Siirry backend-kansioon ja asenna riippuvuudet:

```bash
cd backend
npm install
```

Luo `.env` tiedosto backend-kansioon:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/simplechef"
JWT_SECRET="your-super-secret-jwt-key-here"
```

Suorita tietokantamigraatiot ja generoi Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

Lisää testidataa (valinnainen):

```bash
npx ts-node prisma/script.ts
```

### Frontend-asennus

Siirry frontend-kansioon ja asenna riippuvuudet:

```bash
cd frontend
npm install
```

## Käyttöönotto

### Backend-palvelimen käynnistys

Siirry backend-kansioon ja käynnistä kehityspalvelin:

```bash
cd backend
npm run dev
```

Backend käynnistyy osoitteeseen `http://localhost:3000`.

### Frontend-kehityspalvelimen käynnistys

Siirry frontend-kansioon ja käynnistä kehityspalvelin:

```bash
cd frontend
npm run dev
```

Frontend käynnistyy osoitteeseen `http://localhost:5173`.

## Testikäyttäjä

Sovelluksessa on valmiiksi luotu testikäyttäjä, jolla voit kokeilla kaikkia toimintoja:

**Sähköposti:** `test@test.com`  
**Salasana:** `password123`

Voit myös rekisteröidä uuden käyttäjän sovelluksen rekisteröintisivulla.

## API-dokumentaatio

Swagger-pohjainen API-dokumentaatio on saatavilla osoitteessa:
**`http://localhost:3000/api-docs`**

Dokumentaatio sisältää:
- Kaikki saatavilla olevat API-päätepisteet
- Pyynnön ja vastauksen skeemakuvaukset
- JWT-autentikoinnin tiedot
- Interaktiivisen testausympäristön

## Autentikointi

Sovellus käyttää **JWT (JSON Web Token) -pohjaista autentikointia**:
- Käyttäjät voivat rekisteröityä ja kirjautua sisään
- Salasanat tiivistetään turvallisesti bcrypt-kirjastolla
- Kirjautumisen yhteydessä käyttäjä saa JWT-tokenin
- Token lähetetään Authorization-headerissa muodossa `Bearer <token>`
- Suojatut reitit vaativat voimassa olevan tokenin

## Arkkitehtuuri

Frontend käyttää **keskitettyä API-kerrosta** (`src/api/httpClient.ts`), joka:
- Hallinnoi kaikki HTTP-pyynnöt backendiin
- Lisää automaattisesti JWT-tokenin pyyntöihin
- Tarjoaa tyypitetyt API-funktiot TypeScript-tuella
- Käsittelee virhetilanteet yhtenäisesti

## Ominaisuudet

-  **Reseptien hallinta**: Listaus, haku, luonti, muokkaus ja poisto
-  **Käyttäjäautentikointi**: Rekisteröityminen ja kirjautuminen JWT-tokeneilla
-  **Suosikkireseptit**: Käyttäjät voivat merkitä reseptejä suosikeiksi
-  **Reseptien haku**: Client-puolinen hakutoiminto otsikon ja kuvauksen perusteella
-  **Responsiivinen UI**: DaisyUI ja Tailwind CSS -pohjainen käyttöliittymä
-  **API-dokumentaatio**: Swagger-pohjainen dokumentaatio
-  **Tyypitetty kehitys**: Täysi TypeScript-tuki frontend- ja backend-puolella

## Kehittäjätyökalut

### Prisma-komennot

Tietokantahallintaa varten:

```bash
# Prisma Client uudelleengenerointi (tehtävä schema-muutosten jälkeen)
npx prisma generate

# Uuden migraation luominen
npx prisma migrate dev --name migration_name

# Tietokannan resetointi (kehitysympäristössä)
npx prisma migrate reset

# Seed-skriptin ajaminen
npx ts-node prisma/script.ts

# Prisma Studio avaaminen (tietokannan GUI)
npx prisma studio
```

### Hyödyllisiä komentoja

```bash
# Tarkista migraatioiden tila
npx prisma migrate status

# Katso tietokanta-skeema
npx prisma db pull
```

## Projektikansiorakenne

```
WebLoppuProjekti/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── server.ts       # Palvelimen päämoduuli
│   │   ├── swagger.ts      # Swagger-konfiguraatio
│   │   ├── routes/         # API-reitit
│   │   └── middleware/     # Express-middleware
│   ├── prisma/             # Prisma-konfiguraatio
│   │   ├── schema.prisma   # Tietokantaskeema
│   │   └── migrations/     # Tietokantamigraatiot
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # Keskitetty API-kerros
│   │   ├── pages/         # Sivukomponentit
│   │   ├── components/    # Uudelleenkäytettävät komponentit
│   │   ├── contexts/      # React Context API
│   │   └── auth/          # Autentikointitoiminnot
│   └── package.json
└── README.md
```