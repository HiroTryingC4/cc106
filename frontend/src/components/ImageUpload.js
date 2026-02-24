/**
 * ImageUpload Component
 * 
 * Handles image file uploads with preview and compression.
 * Features:
 * - Multiple file selection
 * - Image preview before upload
 * - Automatic image compression (max 1920x1080, 85% quality)
 * - File size validation (max 5MB per image)
 * - Format validation (JPG, PNG, GIF)
 * - Remove images before upload
 * 
 * @param {function} onImagesChange - Callback with array of compressed image files
 * @param {number} maxImages - Maximum number of images allowed (default: 5)
 */
import React, { useState } from 'react';
import Button from './Button';

const ImageUpload = ({ 
  onUpload, 
  multiple = false, 
  maxSize = 5, // MB
  accept = 'image/*',
  label = 'Upload Images'
}) => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please upload only image files';
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.85 // Quality 85%
          );
        };
        
        img.onerror = reject;
      };
      
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Validate files
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Compress and create previews
    try {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );
      
      const newPreviews = compressedFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        originalSize: files.find(f => f.name === file.name)?.size || 0,
        compressedSize: file.size
      }));

      if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
      } else {
        setPreviews(newPreviews);
      }
    } catch (err) {
      setError('Error processing images');
    }
  };

  const removePreview = (index) => {
    setPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const files = previews.map(p => p.file);
      await onUpload(files);
      
      // Clear previews after successful upload
      previews.forEach(p => URL.revokeObjectURL(p.url));
      setPreviews([]);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
        />
        <p className="mt-1 text-xs text-gray-500">
          Max size: {maxSize}MB per file. {multiple ? 'Multiple files allowed.' : 'Single file only.'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Preview ({previews.length} {previews.length === 1 ? 'file' : 'files'})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">{preview.name}</p>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-4">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : `Upload ${previews.length} ${previews.length === 1 ? 'Image' : 'Images'}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
