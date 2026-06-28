# Deployment Guide

## Environment
- Production: https://zainrealestate.netlify.app
- Staging: https://staging.zainrealestate.netlify.app

## Netlify Setup
- Site ID: [your Netlify site ID]
- Build command: `npm run build`
- Publish directory: `dist`

## Secrets
- `NETLIFY_AUTH_TOKEN`: from Netlify
- `NETLIFY_SITE_ID`: from Netlify

## Process
1. Push to `main` triggers automatic deploy.
2. Deployment logs visible in GitHub Actions and Netlify.
3. Post‑deploy smoke test.

## Rollback
Use Netlify "Deploys" tab → "Rollback to previous deploy".