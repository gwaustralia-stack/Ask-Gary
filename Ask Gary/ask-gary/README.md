# Ask Gary — Version 2

This version gives you:
- a custom **Ask Gary** home screen using your supplied image;
- a black, ChatGPT-style layout;
- a bottom composer that behaves like a modern chat app;
- a secure server-side OpenAI connection;
- local browser chat history;
- installable **PWA / phone app** support.

## 1) Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open:

```bash
http://localhost:3000
```

Put your OpenAI API key in `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-6-luna
```

## 2) Test it on your phone on your local Wi-Fi

On your computer, run:

```bash
npx next dev -H 0.0.0.0 -p 3000
```

Find your computer's local IP address.
Examples:
- Mac: `ipconfig getifaddr en0`
- Windows: `ipconfig`

Then on your phone, while connected to the same Wi-Fi, open:

```text
http://YOUR-COMPUTER-IP:3000
```

Example:

```text
http://192.168.1.25:3000
```

## 3) Best way to make it a real app on your phone

The easiest path is to deploy it to **Vercel**.

### Option A — easiest
1. Create a GitHub account if you don't already have one.
2. Create a new repository called `ask-gary`.
3. Upload this project to that repository.
4. Go to **vercel.com** and sign in.
5. Click **Add New Project**.
6. Import your `ask-gary` GitHub repository.
7. In Vercel project settings, add these environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
8. Deploy.
9. Vercel will give you a live HTTPS URL.

### Option B — direct CLI deploy

```bash
npm i -g vercel
vercel
```

Then follow the prompts and add your environment variables when asked.

## 4) Add it to your iPhone home screen

Once the live site is deployed on HTTPS:
1. Open the site in **Safari**.
2. Tap the **Share** button.
3. Tap **Add to Home Screen**.
4. Name it `Ask Gary`.
5. Tap **Add**.

It will appear on your home screen like an app.

## 5) Add it to your Android home screen

Once the live site is deployed on HTTPS:
1. Open the site in **Chrome**.
2. Tap the browser menu.
3. Tap **Install app** or **Add to Home screen**.
4. Confirm.

## 6) Important notes

- The app **will not answer questions unless your OpenAI API key is configured**.
- The app icon uses your supplied image.
- Chat history is stored only in the local browser on that device.
- If you want user logins, cloud chat history, billing, voice, file upload, or image generation, that would be the next upgrade.
