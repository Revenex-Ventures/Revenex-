# Google OAuth Setup

Google Sign-In is pre-configured with a Google Client ID. To make it work locally
you need to add `http://localhost:5173` as an authorized origin in the Google Cloud Console.

## Steps (one-time, 5 minutes)

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Find the OAuth 2.0 Client ID named **Revenex** (or create a new Web client)
3. Under **Authorized JavaScript origins**, click **+ ADD URI**
4. Add: `http://localhost:5173`
5. Click **SAVE**
6. Wait ~5 minutes for Google to propagate the change, then refresh the page

## For production

Add your production domain as an authorized origin, e.g.:
- `https://app.revenex.in`
- `https://www.revenex.in`

## Current Client ID

The Client ID is already set in `artifacts/revenex/.env.local`:

```
VITE_GOOGLE_CLIENT_ID=194854254536-gk0vkcge6152eobcc5ohug17cgfubjfo.apps.googleusercontent.com
```

This is a **public** value — safe to commit to version control.

## If you want your own Google Client ID

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Application type: **Web application**
4. Add authorized origins: `http://localhost:5173` (and your production domain)
5. Copy the Client ID and update `artifacts/revenex/.env.local`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-new-client-id.apps.googleusercontent.com
   ```
6. Restart the frontend (`pnpm run dev` in `artifacts/revenex`)
