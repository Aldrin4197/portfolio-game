# Feedback API Setup

## PHP Backend for Persistent Feedback Storage

This folder contains PHP scripts to save and retrieve feedbacks to/from a JSON file.

### Files:
- `save-feedback.php` - Saves new feedback to feedbacks.json
- `get-feedbacks.php` - Retrieves all feedbacks from feedbacks.json

### Setup Instructions:

#### Option 1: Using PHP Built-in Server (Development)
```bash
# Navigate to project root
cd /path/to/portfoliov3

# Start PHP server (runs on port 8000)
php -S localhost:8000

# Update your Vite proxy in vite.config.ts to point to PHP server
```

#### Option 2: Using Apache/Nginx (Production)
1. Copy the `api` folder to your web server
2. Ensure the `public` folder is writable:
   ```bash
   chmod 755 public
   chmod 664 public/feedbacks.json
   ```
3. Update CORS settings in PHP files if needed

### Vite Configuration:
Add proxy to `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'public',
  },
})
```

### Data Storage:
- Feedbacks are stored in: `/public/feedbacks.json`
- Format: Array of feedback objects
- Auto-created on first feedback submission

### Security Notes:
- CORS is set to allow all origins (`*`) for development
- For production, restrict CORS to your domain
- Consider adding rate limiting
- Validate and sanitize all inputs
