
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import EXIF from "exif-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fixes image orientation based on EXIF data
 * @param file The image file to fix orientation for
 * @returns A Promise that resolves to a corrected data URL
 */
export function fixImageOrientation(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();
    
    reader.onload = function(event) {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file"));
      }
      
      // Create an image element to load the file data
      const img = new Image();
      
      img.onload = function() {
        try {
          // Get orientation from EXIF data
          EXIF.getData(img as any, function() {
            try {
              const orientation = EXIF.getTag(this, "Orientation") || 1;
              
              // Create a canvas to draw the oriented image
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                console.warn("Failed to get canvas context, returning original image");
                return resolve(event.target!.result as string);
              }
              
              // Set proper canvas dimensions
              let width = img.width;
              let height = img.height;
              
              // Set canvas dimensions based on orientation
              if (orientation > 4 && orientation < 9) {
                // Swap width and height for rotated orientations
                canvas.width = height;
                canvas.height = width;
              } else {
                canvas.width = width;
                canvas.height = height;
              }
              
              // Transform context based on orientation
              switch (orientation) {
                case 2:
                  // horizontal flip
                  ctx.transform(-1, 0, 0, 1, width, 0);
                  break;
                case 3:
                  // 180° rotate left
                  ctx.transform(-1, 0, 0, -1, width, height);
                  break;
                case 4:
                  // vertical flip
                  ctx.transform(1, 0, 0, -1, 0, height);
                  break;
                case 5:
                  // vertical flip + 90 rotate right
                  ctx.transform(0, 1, 1, 0, 0, 0);
                  break;
                case 6:
                  // 90° rotate right
                  ctx.transform(0, 1, -1, 0, height, 0);
                  break;
                case 7:
                  // horizontal flip + 90 rotate right
                  ctx.transform(0, -1, -1, 0, height, width);
                  break;
                case 8:
                  // 90° rotate left
                  ctx.transform(0, -1, 1, 0, 0, width);
                  break;
                default:
                  // No transformation needed for orientation 1
                  break;
              }
              
              // Draw image with the proper orientation
              ctx.drawImage(img, 0, 0);
              
              // Convert canvas to data URL
              const correctedDataUrl = canvas.toDataURL(file.type || 'image/jpeg');
              resolve(correctedDataUrl);
            } catch (exifError) {
              console.warn("Error processing EXIF data, returning original image:", exifError);
              resolve(event.target!.result as string);
            }
          });
        } catch (error) {
          console.warn("Error in orientation fix, returning original image:", error);
          resolve(event.target!.result as string);
        }
      };
      
      img.onerror = function() {
        console.warn("Failed to load image, returning original file data");
        resolve(event.target!.result as string);
      };
      
      // Load the image with the file data
      img.src = event.target.result as string;
    };
    
    reader.onerror = function() {
      reject(new Error("Failed to read file"));
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
}
