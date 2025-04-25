'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Play, Film, Scissors } from 'lucide-react';
import Link from 'next/link';
import SideNav from '@/components/SideNav';

interface VideoFile {
  id: string;
  file: File;
  preview: string | null;
  name: string;
  size: number;
  type: string;
  duration?: number;
}

export default function EditorPage() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const validateFile = (file: File): boolean => {
    // Check if file is a video
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError(`File type not supported: ${file.type}. Please upload video files only.`);
      return false;
    }
    
    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 100MB.`);
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
  
    const { files } = e.dataTransfer;
    const validFiles = Array.from(files).filter(validateFile);
  
    validFiles.forEach((file) => {
      const id = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
  
      video.preload = 'metadata';
      video.src = videoUrl;
  
      video.onloadedmetadata = () => {
        video.currentTime = 0.1;
      };
  
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const preview = canvas.toDataURL();
  
        const videoFile: VideoFile = {
          id,
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type,
          duration: video.duration,
        };
  
        setVideoFiles((prev) => [...prev, videoFile]);
        URL.revokeObjectURL(videoUrl);
      };
    });
  }, []);
  

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const { files } = e.target;
  
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (validateFile(file)) {
          const id = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const videoUrl = URL.createObjectURL(file);
          const video = document.createElement('video');
  
          video.preload = 'metadata';
          video.src = videoUrl;
  
          video.onloadedmetadata = () => {
            video.currentTime = 0.1;
          };
  
          video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 180;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const preview = canvas.toDataURL();
  
            const videoFile: VideoFile = {
              id,
              file,
              preview,
              name: file.name,
              size: file.size,
              type: file.type,
              duration: video.duration,
            };
  
            setVideoFiles(prev => [...prev, videoFile]);
            URL.revokeObjectURL(videoUrl);
          };
        }
      });
  
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    }
  };
  

  const removeFile = (id: string) => {
    setVideoFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Video Editor</h1>
          
          {/* Drag and drop area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-10 mb-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Drag & Drop Video Files</h3>
              <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
              
              <label className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                Browse Files
                <input 
                  type="file" 
                  accept="video/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileInputChange}
                />
              </label>
              
              <p className="text-sm text-muted-foreground mt-2">
                Supported formats: MP4, WebM, Ogg, QuickTime
              </p>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {/* Video files list */}
          {videoFiles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Uploaded Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoFiles.map((file) => (
                  <div key={file.id} className="bg-card rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-video bg-muted relative">
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={48} className="text-muted-foreground/50" />
                        </div>
                      )}
                      <button 
                        className="absolute inset-0 m-auto w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                        onClick={() => {
                          // Play video preview functionality would go here
                        }}
                      >
                        <Play size={24} className="text-primary-foreground" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                            {file.duration && ` • ${Math.floor(file.duration / 60)}:${Math.floor(file.duration % 60).toString().padStart(2, '0')}`}
                          </p>
                        </div>
                        <button 
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeFile(file.id)}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Edit button */}
          {videoFiles.length > 0 && (
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ready to Edit</h2>
                <Link 
                  href="/editor/edit" 
                  className="rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Scissors size={18} />
                  Edit Videos
                </Link>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground">Proceed to the editing interface to trim videos, arrange scenes, and create your final cut.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}