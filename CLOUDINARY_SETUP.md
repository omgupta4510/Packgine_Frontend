# Cloudinary Setup for Image Upload

## Steps to configure Cloudinary:

### 1. Create a Cloudinary Account
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for a free account

### 2. Get Your Credentials
- After logging in, go to your Dashboard
- Note down these values:
  - **Cloud Name**: Your unique cloud name
  - **API Key**: Your API key
  - **API Secret**: Your API secret (keep this secure)

### 3. Create an Upload Preset
- Go to Settings → Upload → Upload presets
- Click "Add upload preset"
- Set the following:
  - **Preset name**: Choose a name (e.g., "ecopack_products")
  - **Signing Mode**: "Unsigned" (for client-side uploads)
  - **Resource type**: "Image"
  - **Allowed formats**: jpg, png, gif, webp
  - **Max file size**: 10MB
  - **Transformation**: Optional (you can resize images automatically)

### 4. Update the Code
In `BecomeSupplierPage.tsx`, update these lines:

```tsx
// Replace with your actual cloud name
const response = await fetch(
  `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
  {
    method: 'POST',
    body: formData,
  }
);

// Replace with your upload preset name
formData.append('upload_preset', 'YOUR_UPLOAD_PRESET_NAME');
```

### 5. Environment Variables (Recommended)
Create a `.env` file in your frontend root:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Then update the code to use environment variables:

```tsx
formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
  // ...
);
```

### 6. Security Considerations
- For production, consider using signed uploads with your backend
- Implement file type validation
- Add file size limits
- Consider image optimization settings in Cloudinary

## Current Implementation Features:
- ✅ Multiple image upload
- ✅ Progress indication during upload
- ✅ Image preview with thumbnails
- ✅ Remove uploaded images
- ✅ Image URLs stored with form data
- ✅ Responsive grid layout
- ✅ Skip option if no images needed
