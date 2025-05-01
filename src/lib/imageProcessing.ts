
import EXIF from 'exif-js';
import { Buffer } from 'buffer';
import { toast } from "sonner";

// Flag to disable HEIC conversion after a failure
let heicConversionDisabled = false;

// Define a variable to hold the heic-convert module when loaded
let heicConvert: any = null;

/**
 * Dynamically imports the heic-convert module
 * @returns Promise resolving to the heic-convert module
 */
async function getHeicConvert() {
  if (heicConversionDisabled) {
    return null;
  }

  if (!heicConvert) {
    try {
      // Use dynamic import instead of require
      const module = await import('heic-convert');
      // Handle both default and named exports
      heicConvert = module.default || module;
      
      // Quick check to make sure the module has the expected structure
      if (typeof heicConvert !== 'function') {
        console.warn('heic-convert module does not have the expected structure:', heicConvert);
        heicConversionDisabled = true;
        return null;
      }
      
      return heicConvert;
    } catch (error) {
      console.error('Failed to import heic-convert:', error);
      heicConversionDisabled = true;
      return null;
    }
  }
  return heicConvert;
}

/**
 * Extracts EXIF orientation from an image file
 * @param file The image file to extract orientation from
 * @returns Promise with the orientation value (1-8) or 1 if not found
 */
function extractExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (!e.target?.result) {
          console.log('No result from file reader, using default orientation');
          resolve(1); // Default orientation if we can't read the file
          return;
        }
        
        try {
          const img = new Image();
          
          img.onload = () => {
            try {
              EXIF.getData(img as any, function() {
                try {
                  const orientation = EXIF.getTag(this, 'Orientation') || 1;
                  console.log('Extracted EXIF orientation:', orientation);
                  resolve(orientation);
                } catch (exifError) {
                  console.warn('Error getting EXIF tag:', exifError);
                  resolve(1);
                }
              });
            } catch (exifError) {
              console.warn('Error in EXIF.getData:', exifError);
              resolve(1);
            }
          };
          
          img.onerror = (error) => {
            console.warn('Failed to load image for EXIF extraction:', error);
            resolve(1); // Default orientation on error
          };
          
          // Set the image source
          if (typeof e.target.result === 'string') {
            img.src = e.target.result;
          } else {
            const blob = new Blob([e.target.result as ArrayBuffer]);
            img.src = URL.createObjectURL(blob);
          }
        } catch (imageError) {
          console.error('Error creating image for EXIF extraction:', imageError);
          resolve(1); // Default orientation on error
        }
      };
      
      reader.onerror = (error) => {
        console.error('Failed to read file for EXIF extraction:', error);
        resolve(1); // Default orientation on error
      };
      
      // Try reading as DataURL first as it's more widely supported
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Exception in extractExifOrientation:', error);
      resolve(1); // Default orientation on any error
    }
  });
}

/**
 * Converts a HEIC file to JPEG format
 * @param file The HEIC file to convert
 * @returns Promise with the converted JPEG file or the original file if conversion fails
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  // Check if the file is a HEIC file
  if (!file.type.includes('heic') && !file.name.toLowerCase().endsWith('.heic')) {
    return file;
  }

  // If HEIC conversion has been disabled due to previous errors, return the file as is
  if (heicConversionDisabled) {
    console.warn('HEIC conversion is disabled due to previous errors. Returning original file.');
    toast.error('HEIC format is not supported in this browser. Please convert to JPG/PNG first.');
    return file;
  }

  try {
    console.log('Converting HEIC file:', file.name);
    
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Get heic-convert module
    const convert = await getHeicConvert();
    
    if (!convert) {
      throw new Error('HEIC conversion module not available');
    }
    
    // Convert HEIC to JPEG
    try {
      const jpegBuffer = await convert({
        buffer: Buffer.from(arrayBuffer),
        format: 'JPEG',
        quality: 0.9
      });

      console.log('HEIC conversion successful');
      
      // Create a new File with the converted JPEG
      return new File(
        [jpegBuffer], 
        file.name.replace(/\.heic$/i, '.jpg'),
        { type: 'image/jpeg' }
      );
    } catch (conversionError) {
      console.error('Error in HEIC conversion process:', conversionError);
      heicConversionDisabled = true;
      toast.error('HEIC images are not supported in this browser. Please convert to JPG/PNG first.');
      return file;
    }
  } catch (error) {
    console.error('Error setting up HEIC to JPEG conversion:', error);
    heicConversionDisabled = true;
    toast.error('HEIC format is not supported in this browser. Please convert to JPG/PNG first.');
    return file;
  }
}

/**
 * Fixes the orientation of an image based on EXIF data or provided orientation
 * @param imageFile The image file to fix orientation for
 * @param orientationValue Optional explicit orientation value (1-8)
 * @returns Promise with a data URL of the orientation-corrected image
 */
export function fixImageOrientation(imageFile: File, orientationValue?: number): Promise<string> {
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
          // If orientation was pre-extracted and provided, use it
          // Otherwise try to get it from EXIF data
          if (orientationValue) {
            console.log('Using pre-extracted orientation:', orientationValue);
            applyOrientation(img, orientationValue, resolve);
          } else {
            EXIF.getData(img as any, function() {
              const orientation = EXIF.getTag(this, 'Orientation') || 1;
              console.log('Extracted orientation during fix:', orientation);
              applyOrientation(img, orientation, resolve);
            });
          }
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
 * Helper function to apply orientation transformations
 * @param img Image element
 * @param orientation Orientation value (1-8)
 * @param resolve Promise resolve function
 */
function applyOrientation(img: HTMLImageElement, orientation: number, resolve: (value: string) => void): void {
  // Create canvas for image manipulation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Failed to get canvas context');
    resolve(img.src); // Return original if we can't get canvas context
    return;
  }
  
  console.log('Applying orientation:', orientation);
  
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
}

/**
 * Process image file - converts HEIC to JPEG if needed and fixes orientation
 * @param file The image file to process
 * @returns Promise with the processed image as a data URL
 */
export async function processImageFile(file: File): Promise<string> {
  try {
    // First, check if it's a HEIC file
    const isHeic = file.type.includes('heic') || file.name.toLowerCase().endsWith('.heic');
    let processedFile = file;
    let orientationValue: number | undefined = undefined;
    
    if (isHeic) {
      try {
        // For HEIC files, extract orientation BEFORE conversion
        console.log('Processing HEIC file:', file.name);
        orientationValue = await extractExifOrientation(file);
        console.log('Extracted orientation before conversion:', orientationValue);
        
        // Then convert HEIC to JPEG
        processedFile = await convertHeicToJpeg(file);
        
        // If the processed file is still a HEIC file (conversion failed),
        // fallback to just using data URL of the original file
        if (processedFile.type.includes('heic') || processedFile.name.toLowerCase().endsWith('.heic')) {
          console.warn('HEIC conversion failed, falling back to original file');
          return await fallbackToDataURL(file);
        }
      } catch (heicError) {
        console.error('HEIC handling failed, using original file:', heicError);
        // Fall back to using original file with no orientation fix
        return await fallbackToDataURL(file);
      }
    }
    
    try {
      // Finally fix the orientation - passing the pre-extracted orientation for HEIC files
      // For non-HEIC files, orientation will be undefined and extracted in fixImageOrientation
      return await fixImageOrientation(processedFile, isHeic ? orientationValue : undefined);
    } catch (orientationError) {
      console.error('Orientation fixing failed:', orientationError);
      // If orientation fixing fails, return at least the converted file
      return await fallbackToDataURL(processedFile);
    }
  } catch (error) {
    console.error('Error processing image file:', error);
    // Last resort fallback to original file
    return await fallbackToDataURL(file);
  }
}

/**
 * Fallback function to convert a file to data URL without any processing
 * @param file The file to convert
 * @returns Promise with the file as a data URL
 */
async function fallbackToDataURL(file: File): Promise<string> {
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
