import React, { useState } from 'react';
import PostGenerator from '../components/posts/PostGenerator';
import { useTranslation } from 'react-i18next';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImagePreview {
  url: string;
  file?: File;
  type: 'upload' | 'url';
}

const Posts: React.FC = () => {
  const { t } = useTranslation();
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImagePreview[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
      type: 'upload'
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleUrlAdd = () => {
    if (imageUrl.trim()) {
      setSelectedImages(prev => [...prev, { url: imageUrl, type: 'url' }]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      if (newImages[index].type === 'upload' && newImages[index].url) {
        URL.revokeObjectURL(newImages[index].url);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('posts.title')}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t('posts.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostGenerator />
        </div>
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Media Gallery</h3>
              <Button
                size="sm"
                variant="outline"
                icon={<ImageIcon className="h-4 w-4" />}
                onClick={() => setShowImageModal(true)}
              >
                Add Image
              </Button>
            </div>

            <div className="space-y-4">
              {selectedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    No images added yet. Click "Add Image" to upload or paste image URLs.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Images</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-[#0A66C2] bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">
                    Drag and drop images here, or{' '}
                    <label className="text-[#0A66C2] hover:text-[#004182] cursor-pointer">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Or paste image URL here..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUrlAdd();
                    }
                  }}
                />
                <Button onClick={handleUrlAdd}>Add URL</Button>
              </div>

              {selectedImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images ({selectedImages.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowImageModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowImageModal(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;