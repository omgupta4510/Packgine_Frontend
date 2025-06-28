# URGENT: Cloudinary Upload Preset Setup

## The upload is failing because the upload preset needs to be created in Cloudinary.

### Steps to Fix:

1. **Go to your Cloudinary Dashboard**
   - Visit: https://cloudinary.com/console
   - Login with your account

2. **Create Upload Preset**
   - Click on "Settings" (gear icon) in the top right
   - Go to "Upload" tab
   - Scroll down to "Upload presets"
   - Click "Add upload preset"

3. **Configure the Upload Preset**
   - **Preset name**: `ecopack_uploads`
   - **Signing Mode**: Select "Unsigned" (IMPORTANT!)
   - **Resource type**: "Image"
   - **Allowed formats**: `jpg,png,gif,webp`
   - **Max file size**: `10485760` (10MB)
   - Click "Save"

4. **Create your .env file**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   ```

5. **Update .env with your values**
   ```
   VITE_CLOUDINARY_CLOUD_NAME=dit8gwqom
   VITE_CLOUDINARY_UPLOAD_PRESET=ecopack_uploads
   ```

6. **Restart your development server**
   ```bash
   npm run dev
   ```

## Common Issues:

- ❌ Upload preset doesn't exist → Create it as shown above
- ❌ Upload preset is "Signed" → Change to "Unsigned"
- ❌ Wrong cloud name → Check your dashboard
- ❌ .env file not loaded → Restart dev server

## Testing:
After setup, check browser console (F12) for detailed upload logs.
