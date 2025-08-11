import React, { useState } from 'react';

/**
 * Interface to generate LinkedIn posts with optional images.
 */
import { Sparkles, Clock, Calendar, Image, Share2, Target, X, Upload, Check } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import Input from '../common/Input';
import TemplateLibrary from '../templates/TemplateLibrary';
import { generateContent, publishPost, schedulePost, ApiException, Template } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';


interface ImagePreview {
  url: string;
  file?: File;
  type: 'upload' | 'url';
  selected?: boolean;
}

/**
 * Allows users to craft and publish posts using GPT-generated text.
 */
const PostGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showTargeting, setShowTargeting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [tone, setTone] = useState('Professional');
  const [hashtags, setHashtags] = useState('');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const { user } = useAuthStore();

  const formatHashtags = (tags: string) =>
    tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .map(tag => (tag.startsWith('#') ? tag : `#${tag}`))
      .join(' ');
  

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImagePreview[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
      type: 'upload',
      selected: false
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
      setSelectedImages(prev => [...prev, { url: imageUrl, type: 'url', selected: false }]);
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

  const handleImageSelect = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      newImages[index].selected = !newImages[index].selected;
      return [...newImages];
    });
  };

  const handleTemplateSelect = (template: Template) => {
    setGeneratedContent(template.content);
    setShowTemplateLibrary(false);
  };

  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    const platform = selectedPlatforms[0];
    setIsGenerating(true);
    try {
      const tags = formatHashtags(hashtags);
      const promptWithOptions = `${prompt}${tone ? `\nTone: ${tone}` : ''}${
        tags ? `\nInclude these hashtags: ${tags}` : ''
      }`;
      const text = await generateContent(promptWithOptions, platform);
      setGeneratedContent(text);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiException) {
        alert(err.message);
      } else {
        alert('Failed to generate content');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select a platform');
      return;
    }

    const platform = selectedPlatforms[0];
    const tags = formatHashtags(hashtags);
    const contentToShare = tags ? `${generatedContent}\n\n${tags}` : generatedContent;
    const platformsToUse = platform ? [platform] : [];

    if (platformsToUse.length === 0) {
      alert('Please select at least one platform to publish.');
      return;
    }

    if (scheduledDate && scheduledTime) {
      try {
        const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
        await schedulePost(user?.id || '', contentToShare, platformsToUse, scheduledAt);
        alert('Post scheduled successfully!');
      } catch (err) {
        console.error(err);
        if (err instanceof ApiException) {
          alert(err.message);
        } else {
          alert('Failed to schedule post');
        }
      }
      return;
    }

    const env = import.meta.env as Record<string, string | undefined>;
    const tokenMap = platformsToUse.reduce<Record<string, string>>((acc, p) => {
      const token = env[`VITE_${p.toUpperCase()}_API_KEY`];
      if (token) {
        acc[p] = token;
      }
      return acc;
    }, {});

    for (const p of platformsToUse) {
      if (!tokenMap[p]) {
        alert(`${p} API key not configured`);
        return;
      }
    }

    try {
      for (const p of platformsToUse) {
        await publishPost(contentToShare, p, tokenMap[p]);
      }
      alert('Post published successfully!');
    } catch (err) {
      console.error(err);
      if (err instanceof ApiException) {
        alert(err.message);
      } else {
        alert('Failed to publish post');
      }
    }
  };

  return (
    <Card title="Create Social Media Post">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-4">
            <label
              htmlFor="platform"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Platform
            </label>
            <select
              id="platform"
              value={selectedPlatforms[0] || ''}
              onChange={(e) =>
                setSelectedPlatforms(e.target.value ? [e.target.value] : [])
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A66C2] focus:ring-[#0A66C2]"
            >
              <option value="">Select a platform</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>
          <div className="mb-4">
            <TextArea
              label="What would you like to post about?"
              placeholder="Enter a topic or detailed instructions for GPT..."
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A66C2] focus:ring-[#0A66C2]"
              >
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Friendly">Friendly</option>
                <option value="Humorous">Humorous</option>
              </select>
            </div>
            <Input
              label="Hashtags"
              placeholder="e.g. ai, marketing, startup"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              icon={<Sparkles className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Generate Content
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTargeting(!showTargeting)}
              icon={<Target className="h-4 w-4" />}
            >
              {showTargeting ? 'Hide Targeting' : 'Show Targeting'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTemplateLibrary(true)}
            >
              Choisir un template
            </Button>
          </div>

          {generatedContent && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generated Content
              </label>
              <div className="relative">
                <TextArea
                  rows={8}
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="pr-12"
                />
                <div className="absolute right-3 top-3 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    title="Regenerate content"
                    onClick={handleGenerate}
                  >
                    <Sparkles className="h-4 w-4 text-[#0A66C2]" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {selectedImages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Media ({selectedImages.filter(img => img.selected).length} selected)
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group cursor-pointer ${
                      image.selected ? 'ring-2 ring-[#0A66C2] ring-offset-2' : ''
                    }`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {image.selected && (
                      <div className="absolute inset-0 bg-[#0A66C2] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <div className="bg-[#0A66C2] text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {generatedContent && (
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                icon={<Share2 className="h-4 w-4" />}
                onClick={handlePublish}
              >
                {showScheduler ? 'Schedule Post' : 'Publish Now'}
              </Button>
              <Button
                variant="outline"
                icon={<Clock className="h-4 w-4" />}
                onClick={() => setShowScheduler(!showScheduler)}
              >
                {showScheduler ? 'Publish Immediately' : 'Schedule for Later'}
              </Button>
              <Button
                variant="outline"
                icon={<Image className="h-4 w-4" />}
                onClick={() => setShowImageModal(true)}
              >
                Add Media
              </Button>
            </div>
          )}

          {showTemplateLibrary && (
            <TemplateLibrary
              onSelect={handleTemplateSelect}
              onClose={() => setShowTemplateLibrary(false)}
            />
          )}

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
                          <div
                            key={index}
                            className={`relative group cursor-pointer ${
                              image.selected ? 'ring-2 ring-[#0A66C2] ring-offset-2' : ''
                            }`}
                            onClick={() => handleImageSelect(index)}
                          >
                            <img
                              src={image.url}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {image.selected && (
                              <div className="absolute inset-0 bg-[#0A66C2] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <div className="bg-[#0A66C2] text-white rounded-full p-1">
                                  <Check className="h-4 w-4" />
                                </div>
                              </div>
                            )}
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

          {showScheduler && generatedContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Schedule Publication</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                />
                <Input
                  type="time"
                  label="Time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  icon={<Clock className="h-4 w-4 text-gray-500" />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostGenerator;
