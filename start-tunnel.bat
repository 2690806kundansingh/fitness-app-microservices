@echo off
echo Starting Cloudflare Tunnel for FitPulse API Gateway...
echo Your backend is being shared over secure HTTPS for mobile and Vercel access.
.\cloudflared.exe tunnel --url http://localhost:8085
pause
