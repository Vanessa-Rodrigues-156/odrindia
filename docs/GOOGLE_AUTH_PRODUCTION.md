# Production Deployment Checklist for Google OAuth

## Environment Variables Setup

When deploying to production, ensure these environment variables are set in your hosting platform:

1. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Same Google Client ID you use in development
2. `NEXT_PUBLIC_API_BASE_URL` - Your production API URL (e.g., `https://api.odrlab.com/api`)

## Platform-Specific Instructions

### Vercel
```bash
# Add these environment variables in Vercel dashboard
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_API_BASE_URL=
```

### Netlify
```bash
# Add these environment variables in Netlify dashboard
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_API_BASE_URL=
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Open your project and navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add authorized domains:
   - `odrlab.com` 
   - Any other domains you use
5. Add authorized JavaScript origins:
   - `https://odrlab.com`
   - `https://www.odrlab.com`
   - Any other subdomains you use
6. Add authorized redirect URIs:
   - `https://odrlab.com`
   - `https://odrlab.com/signin`
   - `https://odrlab.com/signup`
   - `https://www.odrlab.com`
   - `https://www.odrlab.com/signin`
   - `https://www.odrlab.com/signup`
   - Any other relevant pages

## Testing

After deployment, verify:
1. That Google Sign-in buttons appear properly
2. That clicking the button opens the Google authentication popup
3. That authentication completes and redirects back to your site
4. That users are properly authenticated in your system
