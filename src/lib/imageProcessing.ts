
import EXIF from 'exif-js';
import { Buffer } from 'buffer';
import { toast } from "sonner";

// Import heic-convert as a dynamic import since it doesn't have proper TypeScript definitions
// and avoid using require() which doesn't work in the browser
let heicConvert: any = null;

// We'll dynamically import heic-convert when needed
async function getHeicConvert() {
  if (!heicConvert) {
    // Use dynamic import instead of require
    const module = await import('heic-convert');
    heicConvert = module.default || module;
  }
  return heicConvert;
}

/**
 * Converts a HEIC file to JPEG format
 * @param file The HEIC file to convert
 * @returns Promise with the converted JPEG file
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    // Check if the file is a HEIC file
    if (!file.type.includes('heic') && !file.name.toLowerCase().endsWith('.heic')) {
      return file;
    }

    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Get heic-convert module
    const convert = await getHeicConvert();
    
    // Convert HEIC to JPEG
    const jpegBuffer = await convert({
      buffer: Buffer.from(arrayBuffer),
      format: 'JPEG',
      quality: 0.9
    });

    // Create a new File with the converted JPEG
    return new File(
      [jpegBuffer], 
      file.name.replace(/\.heic$/i, '.jpg'),
      { type: 'image/jpeg' }
    );
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error);
    toast.error('Failed to convert HEIC image. Please try another format.');
    throw new Error('HEIC conversion failed');
  }
}

/**
 * Fixes the orientation of an image based on EXIF data
 * @param imageFile The image file to fix orientation for
 * @returns Promise with a data URL of the orientation-corrected image
 */
export function fixImageOrientation(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read image file'));
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        try {
          // Get orientation from EXIF data
          EXIF.getData(img as any, function() {
            const orientation = EXIF.getTag(this, 'Orientation') || 1;
            
            // Create canvas for image manipulation
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }
            
            // Set proper canvas dimensions
            let width = img.width;
            let height = img.height;
            
            // Set canvas dimensions based on orientation
            if (orientation > 4 && orientation < 9) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }
            
            // Apply transformations based on orientation
            switch (orientation) {
              case 2: // horizontal flip
                ctx.transform(-1, 0, 0, 1, width, 0);
                break;
              case 3: // 180° rotate
                ctx.transform(-1, 0, 0, -1, width, height);
                break;
              case 4: // vertical flip
                ctx.transform(1, 0, 0, -1, 0, height);
                break;
              case 5: // vertical flip + 90° rotate right
                ctx.transform(0, 1, 1, 0, 0, 0);
                break;
              case 6: // 90° rotate right
                ctx.transform(0, 1, -1, 0, height, 0);
                break;
              case 7: // horizontal flip + 90° rotate right
                ctx.transform(0, -1, -1, 0, height, width);
                break;
              case 8: // 90° rotate left
                ctx.transform(0, -1, 1, 0, 0, width);
                break;
              default:
                // No transformation needed
                break;
            }
            
            // Draw the transformed image
            ctx.drawImage(img, 0, 0);
            
            // Get data URL and resolve
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(dataUrl);
          });
        } catch (error) {
          console.error('Error fixing image orientation:', error);
          // If EXIF processing fails, return the original image
          if (typeof e.target.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to process image'));
          }
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Set the image source
      if (typeof e.target.result === 'string') {
        img.src = e.target.result;
      } else {
        img.src = URL.createObjectURL(new Blob([e.target.result as ArrayBuffer]));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Process image file - converts HEIC to JPEG if needed and fixes orientation
 * @param file The image file to process
 * @returns Promise with the processed image as a data URL
 */
export async function processImageFile(file: File): Promise<string> {
  try {
    // First, convert HEIC to JPEG if needed
    const processedFile = await convertHeicToJpeg(file);
    
    // Then fix the orientation
    return await fixImageOrientation(processedFile);
  } catch (error) {
    console.error('Error processing image file:', error);
    
    // If processing fails, try to at least return the original file as a data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read original file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read original file'));
      reader.readAsDataURL(file);
    });
  }
}
