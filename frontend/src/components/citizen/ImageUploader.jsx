import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2, AlertCircle } from 'lucide-react';
import api, { resolveFileUrl } from '../../services/api';

export const ImageUploader = ({ onImagesChange, initialImages = [], maxImages = 3 }) => {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const samplePhotos = [
    {
      label: 'Pothole photo',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Garbage pile photo',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Broken Streetlight',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Pipeline leakage',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrls = [];
      for (const file of files) {
        if (images.length + uploadedUrls.length >= maxImages) break;
        const res = await api.uploadFile(file);
        if (res.url) {
          uploadedUrls.push(res.url);
        }
      }

      const updated = [...images, ...uploadedUrls].slice(0, maxImages);
      setImages(updated);
      if (onImagesChange) onImagesChange(updated);
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadError(err.message || 'File upload failed. Allowed formats: PNG, JPG, JPEG, WEBP, PDF up to 15MB.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addSampleImage = (url) => {
    if (!images.includes(url) && images.length < maxImages) {
      const updated = [...images, url];
      setImages(updated);
      if (onImagesChange) onImagesChange(updated);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (onImagesChange) onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Attach Photographic Proof (Max {maxImages} files, PNG/JPG/WEBP)
      </label>

      {/* Dropzone */}
      <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        uploading ? 'bg-teal-50/50 border-teal-400' : 'border-slate-300 hover:border-teal-500 bg-slate-50/50'
      }`}>
        <input
          type="file"
          multiple={maxImages > 1}
          accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
          disabled={uploading || images.length >= maxImages}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="p-3 bg-white rounded-full shadow-xs mb-3 text-teal-600">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-700">
            {uploading
              ? 'Uploading to CivicConnect secure storage...'
              : images.length >= maxImages
              ? `Maximum ${maxImages} files reached`
              : 'Click to upload or drag and drop image'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PNG, JPG, JPEG, WEBP up to 15MB
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preset sample images for quick testing */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-500 font-medium">Or select standard evidence reference photos:</span>
        <div className="flex flex-wrap gap-2">
          {samplePhotos.map((s, idx) => (
            <button
              key={idx}
              type="button"
              disabled={images.length >= maxImages || images.includes(s.url)}
              onClick={() => addSampleImage(s.url)}
              className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 transition-colors disabled:opacity-40"
            >
              + {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
              <img src={resolveFileUrl(img)} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
