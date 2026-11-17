// =====================================================================
// MOBILE IMAGE OPTIMIZER UTILITY
// =====================================================================
// Resizes and compresses smartphone photos before upload to ensure
// lightning-fast loading on mobile data while retaining sharp retina quality.

export const optimizeImage = async (
  file,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
) => {
  return new Promise((resolve, reject) => {
    // If not an image or is SVG, return original file
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, fallback to JPEG
        const outputType = 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            // Generate clean filename
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const optimizedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            });

            // Also generate dataUrl for instant local preview
            const previewReader = new FileReader();
            previewReader.onloadend = () => {
              resolve({
                file: optimizedFile,
                dataUrl: previewReader.result,
                originalSize: file.size,
                optimizedSize: optimizedFile.size,
                width,
                height,
                filename: cleanName,
              });
            };
            previewReader.readAsDataURL(optimizedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};

// Batch optimize multiple images
export const optimizeMultipleImages = async (files) => {
  const promises = Array.from(files).map((f) => optimizeImage(f));
  return Promise.all(promises);
};
