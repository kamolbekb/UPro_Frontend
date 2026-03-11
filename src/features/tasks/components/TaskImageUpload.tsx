import { useCallback, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import { cn } from '@shared/utils/cn';
import { Button } from '@shared/components/ui/button';

interface TaskImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

/**
 * Image upload component with drag-drop, preview, and compression
 *
 * Features:
 * - Drag and drop file upload
 * - Image preview with removal
 * - Client-side compression before upload
 * - File validation (type and size)
 * - Maximum 5 images, 5MB each
 *
 * Usage:
 * ```tsx
 * <TaskImageUpload
 *   images={images}
 *   onChange={setImages}
 * />
 * ```
 */
export function TaskImageUpload({
  images,
  onChange,
  maxImages = 5,
  maxSizeMB = 5,
}: TaskImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  /**
   * Compress image file before upload
   */
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Target compressed size
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      // Return original file if compression fails
      return file;
    }
  };

  /**
   * Validate and process selected files
   */
  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList) return;

      const files = Array.from(fileList);

      // Validate file count
      if (images.length + files.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Validate file types
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

      if (invalidFiles.length > 0) {
        toast.error('Only JPEG, PNG, WEBP, and GIF images are allowed');
        return;
      }

      // Validate file sizes
      const oversizedFiles = files.filter((file) => file.size > maxSizeMB * 1024 * 1024);

      if (oversizedFiles.length > 0) {
        toast.error(`Each image must be smaller than ${maxSizeMB}MB`);
        return;
      }

      // Compress images
      setIsCompressing(true);
      try {
        const compressedFiles = await Promise.all(
          files.map((file) => compressImage(file))
        );

        onChange([...images, ...compressedFiles]);
        toast.success(`${compressedFiles.length} image(s) added`);
      } catch (error) {
        toast.error('Failed to process images');
        console.error('Image processing error:', error);
      } finally {
        setIsCompressing(false);
      }
    },
    [images, onChange, maxImages, maxSizeMB]
  );

  /**
   * Handle file input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow re-selecting the same file
    e.target.value = '';
  };

  /**
   * Handle drag and drop events
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  /**
   * Remove image from list
   */
  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
          isCompressing && 'pointer-events-none opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          onChange={handleInputChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={isCompressing || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-3">
            <Upload className="h-6 w-6 text-gray-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {isCompressing
                ? 'Compressing images...'
                : 'Drop images here or click to upload'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {maxImages - images.length} of {maxImages} images remaining • Max {maxSizeMB}MB
              each
            </p>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {images.map((file, index) => (
            <div key={`${file.name}-${index}`} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  onLoad={(e) => {
                    // Clean up object URL to prevent memory leaks
                    URL.revokeObjectURL((e.target as HTMLImageElement).src);
                  }}
                />
              </div>

              {/* Remove button */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Image icon indicator */}
              <div className="absolute bottom-1 left-1 rounded bg-black/50 p-1">
                <ImageIcon className="h-3 w-3 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
