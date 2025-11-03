import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/vercel-blob';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  maxSize?: number; // in MB
  accept?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  folder = 'uploads',
  label = 'Şəkil Yüklə',
  maxSize = 5,
  accept = 'image/*',
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Şəkil ölçüsü ${maxSize}MB-dan böyük ola bilməz`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Yalnız şəkil faylları yüklənə bilər');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      setUploading(true);
      const pathname = `${folder}/${Date.now()}-${file.name}`;
      const url = await uploadImage(file, pathname);
      onChange(url);
      toast.success('Şəkil uğurla yükləndi');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Şəkil yüklənərkən xəta baş verdi');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload-input"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Yüklənir...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {value ? 'Şəkil Dəyişdir' : 'Şəkil Seç'}
              </>
            )}
          </Button>
        </div>
        {preview && (
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-lg border border-border overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {value && !preview && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span className="truncate max-w-xs">{value}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

