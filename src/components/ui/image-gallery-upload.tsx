import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/vercel-blob';
import { toast } from 'sonner';

interface ImageGalleryUploadProps {
  value?: string[]; // Array of image URLs
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxSize?: number; // in MB
  maxImages?: number;
  accept?: string;
}

export const ImageGalleryUpload = ({
  value = [],
  onChange,
  folder = 'uploads',
  label = 'Şəkillər Yüklə',
  maxSize = 5,
  maxImages = 10,
  accept = 'image/*',
}: ImageGalleryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [previews, setPreviews] = useState<Map<number, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = value || [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check total image count
    if (images.length + files.length > maxImages) {
      toast.error(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz`);
      return;
    }

    // Validate all files first
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} - Şəkil ölçüsü ${maxSize}MB-dan böyük ola bilməz`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} - Yalnız şəkil faylları yüklənə bilər`);
        return;
      }
    }

    // Upload files sequentially
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const currentIndex = images.length + i;
      
      try {
        setUploading(true);
        setUploadingIndex(currentIndex);

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => new Map(prev).set(currentIndex, e.target?.result as string));
        };
        reader.readAsDataURL(file);

        // Upload image
        const pathname = `${folder}/${Date.now()}-${i}-${file.name}`;
        const url = await uploadImage(file, pathname);
        uploadedUrls.push(url);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`${file.name} yüklənərkən xəta baş verdi`);
        setPreviews(prev => {
          const newMap = new Map(prev);
          newMap.delete(currentIndex);
          return newMap;
        });
      } finally {
        setUploadingIndex(null);
        if (i === files.length - 1) {
          setUploading(false);
        }
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} şəkil uğurla yükləndi`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = images.filter((_, i) => i !== index);
    onChange(newUrls);
    
    // Remove preview
    setPreviews(prev => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });
  };

  const handleRemoveAll = () => {
    onChange([]);
    setPreviews(new Map());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {images.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveAll}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4 mr-1" />
            Hamısını Sil
          </Button>
        )}
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          id="image-gallery-upload-input"
          disabled={uploading || images.length >= maxImages}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="w-full"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Yüklənir... ({uploadingIndex !== null ? `${uploadingIndex + 1}/${images.length + 1}` : ''})
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {images.length > 0 ? `Daha Çox Şəkil Əlavə Et (${images.length}/${maxImages})` : 'Şəkillər Seç'}
            </>
          )}
        </Button>
        {images.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {images.length} şəkil yüklənib (maksimum: {maxImages})
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => {
            const preview = previews.get(index) || url;
            return (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg border border-border overflow-hidden bg-muted">
                  <img
                    src={preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemove(index)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

