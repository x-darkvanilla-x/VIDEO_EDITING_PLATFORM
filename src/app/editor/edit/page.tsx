'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Scissors, Plus, Trash2, MoveHorizontal, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import SideNav from '@/components/SideNav';

interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  thumbnail: string;
  videoIndex?: number;
}

interface VideoInfo {
  url: string;
  name: string;
  duration: number;
}

export default function EditPage() {
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [draggedSegment, setDraggedSegment] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize videos from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const videosParam = searchParams.get('videos');
    
    if (videosParam) {
      const videosList = JSON.parse(decodeURIComponent(videosParam));
      setVideos(videosList);
    }

    // Initialize segments
    const mockSegments: VideoSegment[] = [
      {
        id: 'segment-1',
        startTime: 0,
        endTime: 15,
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%23718096"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Scene 1</text></svg>'
      },
      {
        id: 'segment-2',
        startTime: 15,
        endTime: 30,
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%234A5568"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Scene 2</text></svg>'
      },
      {
        id: 'segment-3',
        startTime: 30,
        endTime: 45,
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%232D3748"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Scene 3</text></svg>'
      }
    ];
    
    setSegments(mockSegments);
    setDuration(60); // Mock 60 seconds duration
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', () => {
        if (!seeking) {
          setCurrentTime(videoRef.current?.currentTime || 0);
        }
      });
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current?.duration || 0);
      });
    }
  }, [seeking]);

  useEffect(() => {
    if (videoRef.current) {
      setIsPlaying(false);
      setCurrentTime(0);
      videoRef.current.currentTime = 0;
      setDuration(videoRef.current.duration || 0);
    }
  }, [currentVideoIndex]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      const newTime = percent * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeekStart = () => {
    setSeeking(true);
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
    }
  };

  const handleSeekEnd = () => {
    setSeeking(false);
    if (videoRef.current && isPlaying) {
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleAddSegment = () => {
    // Mock adding a new segment
    const newSegment: VideoSegment = {
      id: `segment-${Date.now()}`,
      startTime: currentTime,
      endTime: Math.min(currentTime + 10, duration),
      thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%23553C9A"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">New Scene</text></svg>`,
      videoIndex: currentVideoIndex
    };
    
    setSegments([...segments, newSegment]);
  };

  const handleRemoveSegment = (id: string) => {
    setSegments(segments.filter(segment => segment.id !== id));
  };

  const handleDragStart = (id: string) => {
    setDraggedSegment(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedSegment || draggedSegment === targetId) {
      setDraggedSegment(null);
      return;
    }

    const draggedIndex = segments.findIndex(segment => segment.id === draggedSegment);
    const targetIndex = segments.findIndex(segment => segment.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newSegments = [...segments];
      const [removed] = newSegments.splice(draggedIndex, 1);
      newSegments.splice(targetIndex, 0, removed);
      setSegments(newSegments);
    }
    
    setDraggedSegment(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-10">
          <div className="flex items-center mb-8">
            <Link href="/editor" className="mr-4 p-2 rounded-full hover:bg-accent">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Video Timeline Editor</h1>
          </div>
          
          {/* Video preview area */}
          <div className="bg-card rounded-xl overflow-hidden shadow-sm mb-8">
            <div className="aspect-video bg-black relative">
              {videos.length > 0 ? (
                <>
                  <video
                    ref={videoRef}
                    src={videos[currentVideoIndex].url}
                    className="w-full h-full"
                    onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {videos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`px-3 py-1 rounded ${index === currentVideoIndex ? 'bg-primary text-primary-foreground' : 'bg-black/50 text-white'}`}
                      >
                        Video {index + 1}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-lg">No videos selected</div>
                </div>
              )}
              
              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 flex items-center">
                <button 
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-4"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <div 
                  className="flex-1 h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
                  onClick={handleSeek}
                  onMouseDown={handleSeekStart}
                  onMouseUp={handleSeekEnd}
                  onMouseLeave={handleSeekEnd}
                >
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                
                <div className="ml-4 text-white text-sm">
                  {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
                  {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Editing tools */}
          <div className="flex gap-4 mb-6">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={handleAddSegment}
            >
              <Plus size={18} />
              Add Scene
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
              <Scissors size={18} />
              Split
            </button>
          </div>
          
          {/* Timeline interface */}
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>
            
            {/* Time markers */}
            <div className="flex mb-2">
              {Array.from({ length: Math.ceil(duration / 10) + 1 }).map((_, i) => (
                <div key={i} className="flex-1 text-xs text-muted-foreground">
                  {i * 10}s
                </div>
              ))}
            </div>
            
            {/* Timeline ruler */}
            <div className="h-2 bg-muted rounded-full mb-4 relative">
              {/* Current time indicator */}
              <div 
                className="absolute top-0 h-4 w-0.5 bg-primary -translate-y-1" 
                style={{ left: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            
            {/* Video segments */}
            <div 
              ref={timelineRef}
              className="flex gap-2 overflow-x-auto pb-4"
              onDragOver={handleDragOver}
            >
              {segments.map((segment) => (
                <div 
                  key={segment.id}
                  className={`relative flex-shrink-0 w-40 rounded-md overflow-hidden border-2 ${draggedSegment === segment.id ? 'border-primary' : 'border-transparent'}`}
                  draggable
                  onDragStart={() => handleDragStart(segment.id)}
                  onDrop={() => handleDrop(segment.id)}
                >
                  <img 
                    src={segment.thumbnail} 
                    alt={`Segment ${segment.id}`}
                    className="w-full aspect-video object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                      onClick={() => handleRemoveSegment(segment.id)}
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                    
                    <button className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors">
                      <MoveHorizontal size={16} className="text-white" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white">
                    {Math.floor(segment.startTime)}s - {Math.floor(segment.endTime)}s
                  </div>
                </div>
              ))}
              
              {segments.length === 0 && (
                <div className="w-full py-10 flex items-center justify-center text-muted-foreground">
                  No segments added. Click "Add Scene" to create your first segment.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}