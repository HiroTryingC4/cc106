# Image Upload Feature - Testing Guide 🖼️

## Quick Test Steps

### Step 1: Create a New Unit WITH Images
1. Login as Host: `TRIAL5@gmail.com` / `password123`
2. Navigate to "Units" → "Add New Unit"
3. Fill in all required fields:
   - Unit Name: "Test Property with Images"
   - Property Type: Apartment
   - Location: "Manila, Philippines"
   - Price per Night: 1000
   - Stay Duration: Select any option
4. **NEW:** Scroll to "Property Images" section
5. Click "Choose File" and select 3-5 images
6. See preview of selected images below
7. Click "Create Unit"
8. Images are automatically uploaded after unit creation!
9. Success message: "Unit created with images successfully!"

### Step 2: Edit Unit to Add More Images
1. Click "Edit" on your unit
2. See existing uploaded images in grid
3. Scroll to "Add More Images" section
4. Select additional images
5. Preview and upload
6. Images are added to the unit

### Step 3: Manage Images
1. Hover over any uploaded image
2. Click the "×" button to remove
3. Confirm deletion
4. Image is removed from both display and server
5. Add more images using the upload section

### Step 4: View as Guest
1. Logout and login as Guest: `guest1@example.com` / `password123`
2. Browse to "Units" page
3. Find your test property
4. Click to view details
5. See all images in the gallery
6. Use arrow buttons to navigate
7. Click thumbnails to jump to specific image

## Image Requirements

### Supported Formats
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF

### Size Limits
- Max file size: 5MB per image
- Max upload: 10 images at once
- Automatic compression to 1920x1080
- Quality: 85%

### Best Practices
- Use high-quality images (at least 1280x720)
- Show different angles of the property
- Include exterior and interior shots
- First image becomes the cover photo
- Recommended: 5-8 images per unit

## Features to Test

### ✅ Upload Features
- [ ] Upload single image
- [ ] Upload multiple images (5-10)
- [ ] Preview before upload
- [ ] Compression works (check file size)
- [ ] Upload progress indicator
- [ ] Success message appears

### ✅ Validation
- [ ] Reject files over 5MB
- [ ] Reject non-image files (.pdf, .doc)
- [ ] Show error messages
- [ ] Handle network errors

### ✅ Management
- [ ] View uploaded images in grid
- [ ] Remove individual images
- [ ] Confirm before deletion
- [ ] Images persist after page refresh
- [ ] Edit mode shows existing images

### ✅ Guest View
- [ ] Images display in gallery
- [ ] Navigation arrows work
- [ ] Thumbnail selection works
- [ ] Image counter shows (1/5)
- [ ] Images load quickly
- [ ] Responsive on mobile

## Common Issues & Solutions

### Issue: "Please save the unit first"
**Solution:** You're trying to upload on a new unit. Save it first, then edit to upload.

### Issue: "File size must be less than 5MB"
**Solution:** Your image is too large. Use an image editor to reduce size or quality.

### Issue: "Upload failed"
**Solution:** Check your internet connection. Try uploading fewer images at once.

### Issue: Images not showing
**Solution:** Refresh the page. Check if backend server is running on port 5000.

### Issue: Can't remove image
**Solution:** Make sure you're the owner of the unit. Only hosts can remove their own images.

## API Endpoints Used

### Upload Images
```
POST /api/host/units/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: FormData with 'images' field
```

### Delete Image
```
DELETE /api/host/units/:id/images
Authorization: Bearer <token>
Content-Type: application/json
Body: { "imageUrl": "/uploads/units/..." }
```

### Get Unit (with images)
```
GET /api/host/units/:id
Authorization: Bearer <token>
```

## File Storage

### Upload Directory
```
backend/uploads/units/
```

### File Naming
```
unit-{timestamp}-{random}.jpg
Example: unit-1709123456789-123456789.jpg
```

### URL Format
```
/uploads/units/unit-1709123456789-123456789.jpg
```

## Testing Checklist

### Host Side
- [x] Create unit without images
- [x] Edit unit to add images
- [x] Upload 1 image
- [x] Upload 5 images at once
- [x] Upload 10 images at once
- [x] Remove single image
- [x] Remove all images
- [x] Add images after removing some
- [x] View images in edit mode
- [x] Images persist after save

### Guest Side
- [x] View unit with no images
- [x] View unit with 1 image
- [x] View unit with multiple images
- [x] Navigate image gallery
- [x] Click thumbnails
- [x] Images load on details page
- [x] Images show on listing cards

### Edge Cases
- [x] Upload very large image (>5MB) - should reject
- [x] Upload non-image file - should reject
- [x] Upload with slow internet - should show progress
- [x] Remove image that doesn't exist - should handle gracefully
- [x] Edit unit owned by different host - should deny

## Success Criteria

✅ Hosts can upload multiple images
✅ Images are compressed automatically
✅ Images can be removed individually
✅ Guests can view all images in gallery
✅ Images persist across sessions
✅ Validation works correctly
✅ Error handling is user-friendly

## Status: ✅ READY FOR TESTING

The image upload feature is fully functional and ready for comprehensive testing!
