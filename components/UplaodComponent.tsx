'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Loader2,
  X,
  ImageIcon,
  Sparkles,
  Wand2,
  Camera,
} from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';

interface UploadImageDialogProps {
  productId: string;
  onUploadComplete?: (newImages: string[]) => void;
}

export function UploadComponent({
  productId,
  onUploadComplete,
}: UploadImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      setSelectedFiles(files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i: number) => i !== index);
    const newUrls = previewUrls.filter((_, i: number) => i !== index);

    // Revoke the removed URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Add each file to FormData
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Uploading files:', selectedFiles);
      console.log('Product ID:', productId);

      const response = await axios.patch(
        `/api/uploadImages/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload successful:', response.data);

      if (response.data.success) {
        toast.success(
          `Successfully uploaded ${response.data.addedImages.length} images!`
        );

        onUploadComplete?.(response.data.addedImages);

        // Reset form
        setSelectedFiles([]);
        setPreviewUrls([]);
        setIsOpen(false);
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing images:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        toast.error(`Upload failed: ${errorMessage}`);
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    previewUrls.forEach((url: string) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Images
          <Sparkles className="h-3 w-3 ml-1 animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="relative">
              <Camera className="h-6 w-6 text-blue-600" />
              <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            Add More Images
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            &quot;Add multiple angles and details to help customers see your
            product better&quot;
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Enhanced File Upload Area */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Select Your Images
            </Label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/50 scale-105'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag & drop your images here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse your files
                  </p>

                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="pointer-events-none bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
                  >
                    Choose Files
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span>JPG</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>PNG</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>WebP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Image Previews */}
          {previewUrls.length > 0 && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Selected Images ({selectedFiles.length})
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewUrls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg text-center truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {selectedFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedFiles.length === 0}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="animate-pulse">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                  <Sparkles className="h-3 w-3 ml-2 animate-pulse" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
