# GitHub Actions Environment Setup Guide

To fix the Google OAuth issues in production, follow these steps:

## 1. Add GitHub Secrets

Go to your repository's settings on GitHub:
1. Click on "Settings"
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add the following secrets:

| Name | Value | Description |
|------|-------|-------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-google-client-id.apps.googleusercontent.com` | The Google OAuth client ID |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.odrlab.com/api` | Your production API URL |
| `ENV_FILE` | (contents of your `.env` file) | All your environment variables |

## 2. Update Workflow (Already Done)

The GitHub workflow has been updated to:
- Create both `.env` and `.env.production` files
- Copy the `.env.production` file to the EC2 instance
- Verify environment variables during deployment
- Include environment variables during build

## 3. Verify Environment in Production

After deploying, SSH into your EC2 instance:

```bash
ssh ec2-user@your-ec2-instance
cd /home/ec2-user/odrlab-frontend
bun check-env.js
```

This will show if the environment variables are correctly set.

## 4. Debugging Google OAuth in Production

If Google OAuth still doesn't work:

1. Open the browser's Developer Tools (F12)
2. Look for errors in the Console tab
3. Check for "Missing client_id" or similar errors
4. Verify that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is actually available in the deployed application

## 5. Common Issues & Solutions

- **Missing environment variables**: Add them to GitHub Secrets
- **Build-time vs runtime**: Make sure to use NEXT_PUBLIC_ prefix for client-side variables
- **Google Console settings**: Check that your production domain is authorized
