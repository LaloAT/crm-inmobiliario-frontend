import React, { useCallback, useRef, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Upload, Star, Trash2, Loader2, X, ImageIcon } from 'lucide-react';
import { propertyService } from '../../services/property.service';
import type { PropertyImage } from '../../types/property.types';

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

interface PropertyImageSectionProps {
  propertyId: string;
}

export const PropertyImageSection: React.FC<PropertyImageSectionProps> = ({ propertyId }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getById(propertyId),
  });

  const images: PropertyImage[] = property?.images ?? [];

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => propertyService.deletePropertyImage(propertyId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const coverMutation = useMutation({
    mutationFn: (imageId: string) => propertyService.setCoverImage(propertyId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const uploadFile = useCallback(
    async (file: File) => {
      const uploadId = `${Date.now()}-${file.name}`;
      setUploadingFiles((prev) => [
        ...prev,
        { id: uploadId, name: file.name, progress: 0, status: 'uploading' },
      ]);

      try {
        await propertyService.uploadPropertyImage(propertyId, file, (progress) => {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === uploadId ? { ...f, progress } : f)),
          );
        });
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 100, status: 'done' } : f)),
        );
        queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        // Remove completed entry after a short delay
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
        }, 1500);
      } catch {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId ? { ...f, status: 'error', error: 'Error al subir' } : f,
          ),
        );
      }
    },
    [propertyId, queryClient],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          uploadFile(file);
        }
      });
    },
    [uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const dismissUpload = (uploadId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Imágenes</h4>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          Arrastra imágenes aquí o <span className="text-primary-600 font-medium">haz clic para seleccionar</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Upload progress list */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm"
            >
              <span className="truncate flex-1">{file.name}</span>
              {file.status === 'uploading' && (
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
              {file.status === 'done' && (
                <span className="text-green-600 text-xs font-medium">Listo</span>
              )}
              {file.status === 'error' && (
                <>
                  <span className="text-red-600 text-xs">{file.error}</span>
                  <button onClick={() => dismissUpload(file.id)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
              <img
                src={img.url}
                alt={img.fileName}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {img.isCover && (
                <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Portada
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isCover && (
                  <button
                    type="button"
                    onClick={() => coverMutation.mutate(img.id)}
                    disabled={coverMutation.isPending}
                    className="p-2 bg-white rounded-full text-yellow-600 hover:bg-yellow-50 transition-colors"
                    title="Marcar como portada"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(img.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        uploadingFiles.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <ImageIcon className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">Sin imágenes aún</p>
          </div>
        )
      )}
    </div>
  );
};
