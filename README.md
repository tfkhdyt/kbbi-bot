## KBBI Bot

Sebuah Bot Telegram KBBI yang datanya diambil menggunakan metode _Web Scraping_. Sumber datanya diambil dari [situs resmi KBBI](https://kbbi.kemdikbud.go.id)

## Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org)
- [Cheerio](https://cheerio.js.org/)
- [Telegraf](https://telegraf.js.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org)
- Node.js Package Manager (NPM, Yarn, PNPM)

### Installation

1. Clone repo ini

```bash
git clone https://github.com/tfkhdyt/kbbi-bot
```

2. Masuk ke folder kbbi-bot

```bash
cd kbbi-bot
```

3. Install dependencies

```bash
# NPM
npm install

# Yarn
yarn install

# PNPM
pnpm install
```

4. Jalankan Bot

```bash
# NPM
npm run dev

# Yarn
yarn dev

# PNPM
pnpm dev
```

### Usage

- Run the bot (watch mode)

```bash
# NPM
npm run dev

# Yarn
yarn dev

# PNPM
pnpm dev
```

- Build

```bash
# NPM
npm run build

# Yarn
yarn build

# PNPM
pnpm build
```

- Run the bot

```bash
# NPM
npm run start

# Yarn
yarn start

# PNPM
pnpm start
```

- Format the code (Prettier)

```bash
# NPM
npm run format

# Yarn
yarn format

# PNPM
pnpm format
```

- Lint the code (ESLint)

```bash
# NPM
npm run lint

# Yarn
yarn lint

# PNPM
pnpm lint
```

### Configuration

Cek file [src/config/config.ts](https://github.com/tfkhdyt/kbbi-bot/blob/main/src/config/config.ts)

### Environment Variable

| name         | type                          | required?              | description                                            |
| ------------ | ----------------------------- | ---------------------- | ------------------------------------------------------ |
| `BOT_DOMAIN` | `URL`                         | true (Production only) | URL bot yang telah di-hosting, untuk keperluan webhook |
| `PORT`       | `number`                      | false                  | Port untuk server                                      |
| `BOT_TOKEN`  | `string`                      | true                   | Token dari Bot Telegram                                |
| `NODE_ENV`   | `development` or `production` | true                   | Mode bot                                               |
| `ADMIN_ID`   | `number`                      | true                   | ID dari Admin, untuk keperluan bug report              |

## Contact

<p align=center>
  <a href="https://facebook.com/tfkhdyt142"><img height="30" src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"></a>&nbsp;
  <a href="https://twitter.com/tfkhdyt"><img height="28" src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg"></a>&nbsp;
  <a href="https://instagram.com/_tfkhdyt_"><img height="30" src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"></a>&nbsp;
  <a href="https://youtube.com/tfkhdyt"><img height="30" src="https://upload.wikimedia.org/wikipedia/commons/a/a0/YouTube_social_red_circle_%282017%29.svg"></a>&nbsp;
  <a href="https://t.me/tfkhdyt"><img height="30" src="https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg"></a>&nbsp;
  <a href="https://www.linkedin.com/mwlite/in/taufik-hidayat-6793aa200"><img height="30" src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"></a>
  <a href="https://pddikti.kemdikbud.go.id/data_mahasiswa/QUUyNzdEMjktNDk0Ri00RTlDLUE4NzgtNkUwRDBDRjIxOUNB"><img height="30" src="https://i.postimg.cc/YSB2c3DG/1619598282440.png"></a>
  <a href="https://tfkhdyt.my.id/"><img height="31" src="https://www.svgrepo.com/show/295345/internet.svg"></a>
</p>

## Support

Tekan tombol di bawah untuk membantu saya lewat donasi

<p align="center">
  <a href="https://donate.tfkhdyt.my.id/">
    <img src="https://i.postimg.cc/jjRDbZQx/1621036430601.png" width="125px">
  </a>
</p>
