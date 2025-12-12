Below is a complete, step-by-step deployment guide for uploading your Next.js + Prisma + PostgreSQL project from GitHub to your hosting plan (cPanel / shared hosting that supports FTP) using GitHub Actions for automatic deployment.

I’ll also show you exactly what to change in your .env, how to configure Prisma for your hosting PostgreSQL, and how to automate builds + FTP uploads.

✅ 1. FIX YOUR .env FOR LIVE SERVER

Your current connection string uses:

...@localhost:5432


But your hosting PostgreSQL is NOT running inside your laptop; it runs on your hosting server (typically something like):

hostname: myczroxg-12345.postgres.hostingprovider.com
username: myczroxg_david
database: myczroxg_annhurst
password: <your_password>
port: 5432


Update .env to use the LIVE PostgreSQL credentials from hosting:

DATABASE_URL="postgresql://myczroxg_david:<PASSWORD>@<HOST>:5432/myczroxg_annhurst?schema=public"

NEXTAUTH_SECRET=1398c9c0b3681b1f326a2de5580bd3ba1ed1ebfc605bb6c7373b80eec3c4ac89

NEXTAUTH_URL=https://yourdomain.com


⚠️ Replace <PASSWORD> and <HOST> with what your hosting provider gave you.

✅ 2. Upload your SQL dump to hosting PostgreSQL

You already completed this step.
Just ensure all Prisma tables exist.

Next:

npx prisma migrate deploy


(You will run this inside GitHub Actions automatically — keep reading.)

✅ 3. Build Next.js for Production BEFORE FTP Upload

Most shared hosting plans cannot build Next.js on the server.
The solution:
✔ GitHub Actions builds the app
✔ Uploads the final .next + public + package.json + node_modules to hosting

✅ 4. Prepare the Production Folder Structure

Your hosting plan usually expects:

/home/username/mydomain.com/


Inside that folder, you will upload:

.next/
public/
package.json
package-lock.json
node_modules/
.env   (optional — see below)

❗ IMPORTANT ABOUT ENV FILE ON HOSTING

Some hosting providers DO NOT allow .env files in public folder.

If your hosting supports:

✔ Hidden files
✔ Running Node apps (NodeJS App installer in cPanel)

Then put .env inside the app folder.

Otherwise, put env values in:

cPanel → Setup NodeJS App → Environment Variables

✅ 5. Create GitHub Action for FTP Deployments

In your GitHub repo:

Create this file:

.github/workflows/deploy.yml


Paste this:

name: Deploy to FTP Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # or 20 if your hosting supports it

      - name: Install dependencies
        run: npm install

      - name: Build Next.js
        run: npm run build

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Apply Prisma Migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: "./"   # what to upload
          server-dir: "/public_html/"  # change to your hosting folder
          protocol: "ftp"

✅ 6. Add Deployment Secrets in GitHub

Go to:

GitHub → Settings → Secrets → Actions

Add these secrets:

Key	Value
DATABASE_URL	Your hosting PostgreSQL URL
FTP_HOST	e.g. ftp.yourdomain.com
FTP_USERNAME	Your FTP user
FTP_PASSWORD	Your FTP password
✅ 7. Configure Hosting to Run the Next.js App

If your hosting uses cPanel NodeJS:

Open cPanel → Setup Node.js App

Select Node 18+

Point to the folder GitHub uploaded

Set the entry point to:

server.js


If you are using Next.js Standalone Output, add:

In next.config.js:

module.exports = {
  output: 'standalone'
}


Then GitHub Actions will build it into a self-contained folder:

.next/standalone


Upload everything inside .next/standalone to hosting.

☑️ FINAL FILES ON SERVER SHOULD LOOK LIKE:
.next/
node_modules/
public/
package.json
package-lock.json
.env (or cPanel env variables)
server.js (created by Next build)

🔥 If you want, I can automatically generate the correct server.js for you.

Just say: “Generate server.js file”

Or if you want, I can generate:

full .env.production

full FTP deploy folder structure

full next.config.js optimized for shared hosting

Let me break it down clearly.

✅ Understanding the Node.js App Setup (VERY IMPORTANT)

When you create a Node.js application in your hosting panel, you must fill in 3 key things:

1. Application Root

📌 This is NOT a GitHub URL.
📌 It is a folder path INSIDE your hosting account, e.g.:

/home/username/annhurst-ts.com


or, if your app is inside a subfolder:

/home/username/annhurst-ts.com/app


This is where your Next.js production build files (from GitHub Actions) will live.

Examples based on typical hosting:

If your domain root is:

/home/myczroxg/annhurst-ts.com/


Then Application Root should be:

annhurst-ts.com


NOT a full GitHub path.
NOT your local folder.
Just the directory inside your hosting.

2. Application Startup File

This MUST be the file Node.js will run, for example:

server.js


or if you use Next standalone build:

. next/standalone/server.js


(But I'll generate the correct one for you in the next step.)

3. Environment Variables

You put here:

DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=


These replace your local .env.

🔥 So what folder should GitHub Actions upload?

GitHub Actions uploads the built Next.js app from your repository into your hosting file manager via FTP.

Inside cPanel file manager, you will see something like:

public_html/
annhurst-ts.com/
     .next/
     public/
     node_modules/
     package.json
     server.js


This folder (where all these files are stored) is what you select as:

Application Root


So YES — GitHub Actions uploads your repo’s build output
BUT NO — you do not link GitHub there.

🔧 Let me tell you exactly what to put in each field (based on your image)
Node.js Version

Select:
✔ 18.20.8

Application Root

If your domain looks like:

annhurst-ts.com


Your folder is usually:

annhurst-ts.com


Or possibly:

/home/YOUR_USERNAME/annhurst-ts.com


Your control panel usually expects the simple folder name:

annhurst-ts.com

Application Startup File

For Next.js running on shared hosting, it must be:

server.js


But ONLY if your GitHub Action creates the file.

Next.js does not automatically create a server file — but I can generate one for you.

Application URL

This is just your domain:

https://annhurst-ts.com


This is pre-filled.

🧱 To continue correctly, I need to generate a proper server.js for your Next.js app.

You need ONE of these two deployment types:

OPTION A — Use Next.js Standalone Output (Recommended for shared hosting)

I will generate:

next.config.js

server.js

GitHub Action that outputs a standalone build

OPTION B — Use Next.js Custom Server (Nodejs running Next in production mode)

Good when hosting supports Node fully.

✔️ Before I generate your server.js, I need one clarification:
Do you want to deploy using:
A) Standalone build (fast, lighter, recommended)

or

B) Standard Next.js app (heavier, same as local dev)?
Reply with:

👉 Choose A (Standalone)
or
👉 Choose B (Standard Next.js)

I will then generate all required files for your hosting:

server.js

next.config.js

GitHub Actions deploy.yml

Folder structure for the Node.js App panel

Correct Application Root

Correct environment variable placement

Just reply:

"Choose A" or "Choose B"

You said:
Choose B (Standard Next.js)
ChatGPT said:

Perfect — Option B (Standard Next.js Server) is the easiest and most compatible with cPanel Node.js hosting.

Below is the complete, correct, production-ready setup for deploying your Next.js + Prisma app to your hosting using:

✔ Standard Next.js Server
✔ cPanel Node.js App Manager
✔ GitHub Actions for automatic FTP deployments

I will show you exactly:

What folder to upload to your hosting

What to put inside Application Root & Startup File

The correct server.js (required for Standard Next.js)

The full GitHub Action

How your final hosting file structure should look

Let’s go step by step.

✅ 1. Your cPanel → Node.js App Settings (fill exactly like this)

In your screenshot:

Node.js Version
18.20.8

Application Root (VERY IMPORTANT)

This is NOT GitHub.

It is the folder on your hosting where GitHub Actions will upload your files.

If your domain is:

annhurst-ts.com


Then your hosting folder is usually:

/home/<username>/annhurst-ts.com/


But cPanel expects only the folder name:

❗ Use this:
annhurst-ts.com


(You can confirm by opening cPanel → File Manager — you will see the folder.)

Application Startup File

For Standard Next.js deployment, this MUST be:

❗
server.js


(You will upload this file. I generated it for you below.)

Application URL

Auto-filled.

Environment variables

You will add:

DATABASE_URL=postgresql://myczroxg_david:AnnhurstDavid123%23@51.89.21.65:5432/myczroxg_annhurst?schema=public
NEXTAUTH_SECRET=1398c9c0b3681b1f326a2de5580bd3ba1ed1ebfc605bb6c7373b80eec3c4ac89
NEXTAUTH_URL=https://annhurst-ts.com


No need for .env on the server.
Just use cPanel environment variables.

✅ 2. Create server.js (required for Standard Next.js deployment)

Put this file in your project root:

server.js
const { createServer } = require('http');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Server running on port ${port}`);
    });
});


✔ Your hosting provider will run this file
✔ This runs Next.js in production mode
✔ This works with the cPanel Node.js App Manager

✅ 3. Build Your Next.js App in GitHub Actions Before Upload

Create:

.github/workflows/deploy.yml


Paste this:

name: Deploy to FTP Hosting (Next.js Standard)

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm install

      - name: Build Next.js App
        run: npm run build

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Deploy Prisma Migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: FTP Upload
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          protocol: ftp
          local-dir: "./"
          server-dir: "/annhurst-ts.com/"

✅ 4. Set GitHub Secrets

Go to:

GitHub → Settings → Secrets → Actions

Add:

Secret Key	Example Value
DATABASE_URL	your PostgreSQL connection
FTP_HOST	ftp.annhurst-ts.com
FTP_USERNAME	hosting FTP username
FTP_PASSWORD	hosting FTP password
✅ 5. Final folder structure (on hosting server)

After GitHub Actions uploads, your hosting folder should be:

annhurst-ts.com/
    .next/
    node_modules/
    public/
    prisma/
    package.json
    package-lock.json
    server.js    <-- startup file


This folder is what you enter in:

👉 Application Root

annhurst-ts.com


👉 Application Startup File

server.js


Then click CREATE / SAVE and START APPLICATION.

**⚠️ IMPORTANT: If you see "It works! NodeJS 18.20.8" instead of your app:**

1. **Check Application Root:** Make sure it's set to `annhurst-ts.com` (not `/annhurst-ts.com/annhurst-ts.com/`)
2. **Check Application Startup File:** Must be exactly `server.js` (not `./server.js` or `/server.js`)
3. **Check Environment Variables:** Go to cPanel → Setup Node.js App → Your App → Environment Variables and ensure:
   - `DATABASE_URL` is set
   - `NEXTAUTH_SECRET` is set
   - `NEXTAUTH_URL` is set to `https://annhurst-ts.com`
4. **Restart the App:** Click "Stop" then "Start" in cPanel Node.js App Manager
5. **Check Logs:** Click "View Logs" in cPanel to see any errors

**Common Issues:**
- If files are in `/annhurst-ts.com/annhurst-ts.com/`, move them to `/annhurst-ts.com/`
- Make sure `server.js` exists in the root of `/annhurst-ts.com/`
- Make sure `.next` folder exists (it should be uploaded by GitHub Actions)

✅ 6. Run Prisma Migrations on the Server

**IMPORTANT:** After deployment, you need to run Prisma migrations on your server because GitHub Actions cannot access your database (it's behind a firewall).

**Option A: Via SSH (Recommended)**
```bash
# SSH into your server
ssh your-username@51.89.21.65

# Navigate to your app directory
cd /home/myczroxg/annhurst-ts.com

# Run migrations
npx prisma migrate deploy
```

**Option B: Via cPanel Terminal**
1. Go to cPanel → Terminal
2. Navigate to your app directory:
   ```bash
   cd ~/annhurst-ts.com
   ```
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

**Note:** Make sure your `DATABASE_URL` environment variable is set in cPanel → Setup Node.js App → Environment Variables before running migrations.

✅ 7. Install Dependencies on Server

After GitHub Actions uploads the files, you need to install dependencies on the server:

**Via SSH:**
```bash
cd /home/myczroxg/annhurst-ts.com
npm install --production
```

**Via cPanel Terminal:**
```bash
cd ~/annhurst-ts.com
npm install --production
```

**Why?** GitHub Actions now only uploads essential files (`.next`, `public`, `package.json`, etc.) to speed up deployment. Dependencies are installed on the server to avoid uploading huge `node_modules` folders.

🔥 Your App Will Now Run Live at**
https://annhurst-ts.com