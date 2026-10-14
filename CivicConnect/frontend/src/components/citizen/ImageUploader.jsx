import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check } from 'lucide-react';

export const ImageUploader = ({ onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState(initialImages);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Create local object URLs for mock preview
      const newUrls = files.map(file => URL.createObjectURL(file));
      const updated = [...images, ...newUrls];
      setImages(updated);
      if (onImagesChange) onImagesChange(updated);
    }
  };

  const addSampleImage = (url) => {
    if (!images.includes(url)) {
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
        Attach Photographic Proof (Max 3 files, PNG/JPG)
      </label>

      {/* Dropzone */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-500 transition-colors bg-slate-50/50">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="p-3 bg-white rounded-full shadow-xs mb-3 text-teal-600">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Click to upload or drag and drop image
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PNG, JPG, JPEG up to 10MB
          </p>
        </div>
      </div>

      {/* Preset sample images for quick mock testing */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-500 font-medium">Or select standard evidence demo photos:</span>
        <div className="flex flex-wrap gap-2">
          {samplePhotos.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addSampleImage(s.url)}
              className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
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
              <img src={img} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
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
