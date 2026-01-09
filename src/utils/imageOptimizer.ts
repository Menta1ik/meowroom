import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  // If not an image, return original
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: 0.8, // Target size ~800KB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    fileType: 'image/webp', // Convert to WebP
    initialQuality: 0.8 // 80% quality
  };

  try {
    console.log(`Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
    const compressedBlob = await imageCompression(file, options);
    
    // Create new filename with .webp extension
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    
    const compressedFile = new File([compressedBlob], newName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    console.log(`Compressed to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Fallback to original
  }
};
