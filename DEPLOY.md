# Deploy in 3 Minutes (Free)

## 1. Vercel → Frontend (https://vercel.com)

1. Sign up with GitHub → "Add New Project"
2. Import `pcqland-` repo
3. Root Directory: `frontend`
4. Framework: Next.js (auto-detected)
5. Environment Variables (optional for now):
   - `NEXT_PUBLIC_API_URL` = `https://pcdeals-backend.onrender.com/api`
6. Deploy → 1 min → get URL like `pcdeals-frontend.vercel.app`

## 2. Render → Backend (https://render.com)

1. Sign up with GitHub → "New Web Service"
2. Connect `pcqland-` repo
3. Root Directory: `backend`
4. Start Command: `node server.js`
5. Add Environment Variables:
   - `JWT_SECRET` = any random string (e.g., `abc123xyz`)
   - `CLIENT_URL` = your Vercel URL from step 1
   - `RAZORPAY_KEY_ID` = test key (optional)
   - `RAZORPAY_KEY_SECRET` = test secret (optional)
6. Deploy → 2 min → get URL like `pcdeals-backend.onrender.com`

## 3. Update Vercel env var

Go back to Vercel project → Settings → Environment Variables → add:
- `NEXT_PUBLIC_API_URL` = `https://pcdeals-backend.onrender.com/api`

Redeploy (Vercel auto-detects changes).

## 4. Seed demo data

```bash
# In Render dashboard → Shell tab, or locally:
node seed-demo.js
```

## Done! Client ko link bhejo: `https://pcdeals-frontend.vercel.app`
