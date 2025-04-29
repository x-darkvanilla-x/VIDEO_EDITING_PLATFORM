"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Scissors,
  Plus,
  Trash2,
  MoveHorizontal,
  Play,
  Pause,
} from "lucide-react";
import Link from "next/link";
import SideNav from "@/components/SideNav";
import ExportModal from "@/components/ExportModal";

interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  thumbnail: string;
  videoIndex?: number;

  isMuted?: boolean;
}

interface AudioSegment {
  id: string;
  startTime: number;
  endTime: number;
  waveform: string;
  type: "main" | "background";
  volume: number;
  isMuted: boolean;
}

interface ImageOverlay {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    opacity: number;
    border: string;
    animation?: string;
  };
}

interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
}

interface VideoInfo {
  url: string;
  name: string;
  duration: number;
}

export default function EditPage() {
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([]);
  const [backgroundMusic, setBackgroundMusic] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [draggedSegment, setDraggedSegment] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showExportModal, setShowExportModal] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize videos from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const videosParam = searchParams.get("videos");

    if (videosParam) {
      const videosList = JSON.parse(decodeURIComponent(videosParam));
      setVideos(videosList);
    }

    // Initialize segments
    const mockSegments: VideoSegment[] = [
      {
        id: "segment-1",
        startTime: 0,
        endTime: 15,
        thumbnail:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%23718096"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Scene 1</text></svg>',
      },
      {
        id: "segment-2",
        startTime: 15,
        endTime: 30,
        thumbnail:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%234A5568"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Scene 2</text></svg>',
      },
      {
        id: "segment-3",
        startTime: 30,
        endTime: 45,
        thumbnail:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%232D3748"/><text x="80" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Scene 3</text></svg>',
      },
    ];

    setSegments(mockSegments);
    setDuration(60); // Mock 60 seconds duration

    // Initialize mock audio segments
    const mockAudioSegments: AudioSegment[] = [
      {
        id: "audio-1",
        startTime: 0,
        endTime: 15,
        waveform:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="30" viewBox="0 0 160 30"><path d="M0 15 Q 20 5, 40 15 T 80 15 T 120 15 T 160 15" stroke="%23666" fill="none"/></svg>',
        type: "main",
        volume: 1,
        isMuted: false,
      },
      {
        id: "audio-2",
        startTime: 15,
        endTime: 30,
        waveform:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="30" viewBox="0 0 160 30"><path d="M0 15 Q 20 25, 40 15 T 80 15 T 120 15 T 160 15" stroke="%23666" fill="none"/></svg>',
        type: "main",
        volume: 1,
        isMuted: false,
      },
    ];

    setAudioSegments(mockAudioSegments);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", () => {
        if (!seeking) {
          setCurrentTime(videoRef.current?.currentTime || 0);
        }
      });
      videoRef.current.addEventListener("loadedmetadata", () => {
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
      videoIndex: currentVideoIndex,
    };

    setSegments([...segments, newSegment]);
  };

  const handleRemoveSegment = (id: string) => {
    setSegments(segments.filter((segment) => segment.id !== id));
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

    const draggedIndex = segments.findIndex(
      (segment) => segment.id === draggedSegment
    );
    const targetIndex = segments.findIndex(
      (segment) => segment.id === targetId
    );

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
          <ExportModal
            isOpen={showExportModal}
            onClose={() => {
              setShowExportModal(false);
              window.location.href = "/";
            }}
            onExport={() => {}}
          />

          <div className="flex items-center mb-8 justify-between">
            <div className="flex items-center">
              <Link
                href="/editor"
                className="mr-4 p-2 rounded-full hover:bg-accent"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Video Timeline Editor</h1>
            </div>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Export Video
            </button>
          </div>

          {/* Video preview area */}
          <div className="bg-card rounded-xl overflow-hidden shadow-sm mb-8">
            <div className="aspect-video bg-black relative">
              {videos.length > 0 ? (
                <>
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={videos[currentVideoIndex].url}
                      className="w-full h-full"
                      onTimeUpdate={() =>
                        setCurrentTime(videoRef.current?.currentTime || 0)
                      }
                      onLoadedMetadata={() =>
                        setDuration(videoRef.current?.duration || 0)
                      }
                    />
                    {/* Image Overlays */}
                    {imageOverlays.map(
                      (overlay) =>
                        currentTime >= overlay.startTime &&
                        currentTime <= overlay.endTime && (
                          <div
                            key={overlay.id}
                            className="absolute cursor-move"
                            style={{
                              left: `${overlay.position.x}%`,
                              top: `${overlay.position.y}%`,
                              width: `${overlay.size.width}px`,
                              height: `${overlay.size.height}px`,
                              opacity: overlay.style.opacity,
                              border: overlay.style.border,
                              animation: overlay.style.animation,
                              transform: "translate(-50%, -50%)",
                              transition: "all 0.2s ease",
                            }}
                            onMouseDown={(e) => {
                              if (e.target === e.currentTarget) {
                                setIsDragging(true);
                                setSelectedImage(overlay.id);
                                setDragStart({
                                  x: e.clientX,
                                  y: e.clientY,
                                });
                              }
                            }}
                            onMouseMove={(e) => {
                              if (isDragging && selectedImage === overlay.id) {
                                const videoContainer =
                                  e.currentTarget.parentElement;
                                if (videoContainer) {
                                  const rect =
                                    videoContainer.getBoundingClientRect();
                                  const deltaX = e.clientX - dragStart.x;
                                  const deltaY = e.clientY - dragStart.y;
                                  const newX =
                                    overlay.position.x +
                                    (deltaX / rect.width) * 100;
                                  const newY =
                                    overlay.position.y +
                                    (deltaY / rect.height) * 100;

                                  setImageOverlays((overlays) =>
                                    overlays.map((img) =>
                                      img.id === overlay.id
                                        ? {
                                            ...img,
                                            position: { x: newX, y: newY },
                                          }
                                        : img
                                    )
                                  );
                                  setDragStart({ x: e.clientX, y: e.clientY });
                                }
                              }
                            }}
                            onMouseUp={() => {
                              setIsDragging(false);
                              setSelectedImage(null);
                            }}
                            onMouseLeave={() => {
                              setIsDragging(false);
                              setSelectedImage(null);
                            }}
                          >
                            <img
                              src={overlay.url}
                              alt="Overlay"
                              className="w-full h-full object-contain"
                              style={{ pointerEvents: "none" }}
                            />
                            <div className="absolute -top-8 left-0 right-0 flex justify-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={overlay.style.opacity}
                                onChange={(e) => {
                                  setImageOverlays((overlays) =>
                                    overlays.map((img) =>
                                      img.id === overlay.id
                                        ? {
                                            ...img,
                                            style: {
                                              ...img.style,
                                              opacity: parseFloat(
                                                e.target.value
                                              ),
                                            },
                                          }
                                        : img
                                    )
                                  );
                                }}
                                className="w-24"
                              />
                            </div>
                          </div>
                        )
                    )}

                    {/* Subtitle Preview Overlay */}
                    {subtitles.map(
                      (subtitle) =>
                        currentTime >= subtitle.startTime &&
                        currentTime <= subtitle.endTime && (
                          <div
                            key={subtitle.id}
                            className="absolute"
                            style={{
                              left: `${subtitle.position.x}%`,
                              top: `${subtitle.position.y}%`,
                              transform: "translate(-50%, -50%)",
                              fontFamily: subtitle.style.fontFamily,
                              fontSize: `${subtitle.style.fontSize}px`,
                              color: subtitle.style.color,
                              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {subtitle.text}
                          </div>
                        )
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {videos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`px-3 py-1 rounded ${
                          index === currentVideoIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-black/50 text-white"
                        }`}
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
                  {Math.floor(currentTime / 60)}:
                  {Math.floor(currentTime % 60)
                    .toString()
                    .padStart(2, "0")}{" "}
                  /{Math.floor(duration / 60)}:
                  {Math.floor(duration % 60)
                    .toString()
                    .padStart(2, "0")}
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
          <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>

            {/* Audio waveform and controls */}
            <div className="mb-6 space-y-4">
              {/* Time markers */}
              <div className="flex mb-2">
                {Array.from({ length: Math.ceil(duration / 10) + 1 }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="flex-1 text-xs text-muted-foreground"
                    >
                      {i * 10}s
                    </div>
                  )
                )}
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
                    className={`relative flex-shrink-0 w-40 rounded-md overflow-hidden border-2 ${
                      draggedSegment === segment.id
                        ? "border-primary"
                        : "border-transparent"
                    }`}
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
                      {Math.floor(segment.startTime)}s -{" "}
                      {Math.floor(segment.endTime)}s
                    </div>
                  </div>
                ))}

                {segments.length === 0 && (
                  <div className="w-full py-10 flex items-center justify-center text-muted-foreground">
                    No segments added. Click "Add Scene" to create your first
                    segment.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio Wave Forms */}
          <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold mb-4">Audio Tracks</h2>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBackgroundMusic(URL.createObjectURL(file));
                  }
                }}
                className="text-sm text-muted-foreground"
              />
            </div>

            {audioSegments.map((segment) => (
              <div
                key={segment.id}
                className="flex items-center gap-4 p-4 bg-accent rounded-lg mb-2"
              >
                <div className="flex-1">
                  <img
                    src={segment.waveform}
                    alt="Audio waveform"
                    className="w-full h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={segment.volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setAudioSegments((segments) =>
                        segments.map((s) =>
                          s.id === segment.id ? { ...s, volume: newVolume } : s
                        )
                      );
                    }}
                    className="w-24"
                  />
                  <button
                    onClick={() => {
                      setAudioSegments((segments) =>
                        segments.map((s) =>
                          s.id === segment.id
                            ? { ...s, isMuted: !s.isMuted }
                            : s
                        )
                      );
                    }}
                    className={`p-2 rounded-full ${
                      segment.isMuted
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {segment.isMuted ? "🔇" : "🔊"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Image Overlay Editor */}
          <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Image Overlays</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const newOverlay: ImageOverlay = {
                        id: `image-${Date.now()}`,
                        url: e.target?.result as string,
                        position: { x: 50, y: 50 },
                        startTime: currentTime,
                        endTime: Math.min(currentTime + 5, duration),
                        size: { width: 200, height: 200 },
                        style: {
                          opacity: 1,
                          border: "2px solid white",
                        },
                      };
                      setImageOverlays([...imageOverlays, newOverlay]);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus size={18} />
                Add Image
              </label>
            </div>

            {/* Image Overlay List */}
            <div className="space-y-4">
              {imageOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={overlay.url}
                      alt="Overlay preview"
                      className="w-20 h-20 object-contain bg-sidebar rounded"
                    />
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            value={overlay.size.width}
                            onChange={(e) => {
                              setImageOverlays((overlays) =>
                                overlays.map((img) =>
                                  img.id === overlay.id
                                    ? {
                                        ...img,
                                        size: {
                                          ...img.size,
                                          width: Number(e.target.value),
                                        },
                                      }
                                    : img
                                )
                              );
                            }}
                            className="w-full px-2 py-1 rounded bg-sidebar border border-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            value={overlay.size.height}
                            onChange={(e) => {
                              setImageOverlays((overlays) =>
                                overlays.map((img) =>
                                  img.id === overlay.id
                                    ? {
                                        ...img,
                                        size: {
                                          ...img.size,
                                          height: Number(e.target.value),
                                        },
                                      }
                                    : img
                                )
                              );
                            }}
                            className="w-full px-2 py-1 rounded bg-sidebar border border-input"
                          />
                        </div>
                      </div>
                      <div className="mt-4 mb-4">
                        <label className="block text-sm mb-1">Border</label>
                        <select
                          value={overlay.style.border}
                          onChange={(e) => {
                            setImageOverlays((overlays) =>
                              overlays.map((img) =>
                                img.id === overlay.id
                                  ? {
                                      ...img,
                                      style: {
                                        ...img.style,
                                        border: e.target.value,
                                      },
                                    }
                                  : img
                              )
                            );
                          }}
                          className="w-full px-2 py-1 rounded bg-sidebar border border-input"
                        >
                          <option value="none">None</option>
                          <option value="2px solid white">Thin White</option>
                          <option value="4px solid white">Thick White</option>
                          <option value="2px solid black">Thin Black</option>
                          <option value="4px solid black">Thick Black</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Time Range</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={overlay.startTime}
                            onChange={(e) => {
                              const updatedImageOverlay = imageOverlays.map(
                                (s) =>
                                  s.id === overlay.id
                                    ? {
                                        ...s,
                                        startTime: Number(e.target.value),
                                      }
                                    : s
                              );
                              setImageOverlays(updatedImageOverlay);
                            }}
                            className="w-20 px-2 py-1 rounded bg-sidebar border border-input"
                          />
                          <span>to</span>
                          <input
                            type="number"
                            value={overlay.endTime}
                            onChange={(e) => {
                              const updatedSubtitles = subtitles.map((s) =>
                                s.id === overlay.id
                                  ? { ...s, endTime: Number(e.target.value) }
                                  : s
                              );
                              setSubtitles(updatedSubtitles);
                            }}
                            className="w-20 px-2 py-1 rounded bg-sidebar border border-input"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setImageOverlays((overlays) =>
                          overlays.filter((img) => img.id !== overlay.id)
                        )
                      }
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitle Editor */}
          <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Subtitles & Text Overlay
              </h2>
              <button
                onClick={() => {
                  const newSubtitle: Subtitle = {
                    id: `subtitle-${Date.now()}`,
                    text: "New Subtitle",
                    startTime: currentTime,
                    endTime: Math.min(currentTime + 5, duration),
                    position: { x: 50, y: 80 },
                    style: {
                      fontFamily: "Arial",
                      fontSize: 24,
                      color: "#ffffff",
                    },
                  };
                  setSubtitles([...subtitles, newSubtitle]);
                  setSelectedSubtitle(newSubtitle.id);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                Add Subtitle
              </button>
            </div>

            {/* Subtitle List */}
            <div className="space-y-4 mb-6">
              {subtitles.map((subtitle) => (
                <div
                  key={subtitle.id}
                  className={`p-4 rounded-lg border ${
                    selectedSubtitle === subtitle.id
                      ? "border-primary"
                      : "border-border"
                  } cursor-pointer`}
                  onClick={() => setSelectedSubtitle(subtitle.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={subtitle.text}
                      onChange={(e) => {
                        const updatedSubtitles = subtitles.map((s) =>
                          s.id === subtitle.id
                            ? { ...s, text: e.target.value }
                            : s
                        );
                        setSubtitles(updatedSubtitles);
                      }}
                      className="flex-1 px-3 py-1 rounded bg-sidebar border border-input"
                    />
                    <button
                      onClick={() =>
                        setSubtitles(
                          subtitles.filter((s) => s.id !== subtitle.id)
                        )
                      }
                      className="ml-2 p-2 text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {selectedSubtitle === subtitle.id && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Time Range</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={subtitle.startTime}
                            onChange={(e) => {
                              const updatedSubtitles = subtitles.map((s) =>
                                s.id === subtitle.id
                                  ? { ...s, startTime: Number(e.target.value) }
                                  : s
                              );
                              setSubtitles(updatedSubtitles);
                            }}
                            className="w-20 px-2 py-1 rounded bg-sidebar border border-input"
                          />
                          <span>to</span>
                          <input
                            type="number"
                            value={subtitle.endTime}
                            onChange={(e) => {
                              const updatedSubtitles = subtitles.map((s) =>
                                s.id === subtitle.id
                                  ? { ...s, endTime: Number(e.target.value) }
                                  : s
                              );
                              setSubtitles(updatedSubtitles);
                            }}
                            className="w-20 px-2 py-1 rounded bg-sidebar border border-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-1">Position</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={subtitle.position.x}
                            onChange={(e) => {
                              const updatedSubtitles = subtitles.map((s) =>
                                s.id === subtitle.id
                                  ? {
                                      ...s,
                                      position: {
                                        ...s.position,
                                        x: Number(e.target.value),
                                      },
                                    }
                                  : s
                              );
                              setSubtitles(updatedSubtitles);
                            }}
                            className="w-20 px-2 py-1 rounded bg-sidebar border border-input"
                          />
                          <span>x</span>
                          <input
                            type="number"
                            value={subtitle.position.y}
                            onChange={(e) => {
                              const updatedSubtitles = subtitles.map((s) =>
                                s.id === subtitle.id
                                  ? {
                                      ...s,
                                      position: {
                                        ...s.position,
                                        y: Number(e.target.value),
                                      },
                                    }
                                  : s
                              );
                              setSubtitles(updatedSubtitles);
                            }}
                            className="w-20 px-2 py-1 rounded bg-sidebar border border-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-1">
                          Font Family
                        </label>
                        <select
                          value={subtitle.style.fontFamily}
                          onChange={(e) => {
                            const updatedSubtitles = subtitles.map((s) =>
                              s.id === subtitle.id
                                ? {
                                    ...s,
                                    style: {
                                      ...s.style,
                                      fontFamily: e.target.value,
                                    },
                                  }
                                : s
                            );
                            setSubtitles(updatedSubtitles);
                          }}
                          className="w-full px-2 py-1 rounded bg-sidebar border border-input"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Verdana">Verdana</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-1">Font Size</label>
                        <input
                          type="number"
                          value={subtitle.style.fontSize}
                          onChange={(e) => {
                            const updatedSubtitles = subtitles.map((s) =>
                              s.id === subtitle.id
                                ? {
                                    ...s,
                                    style: {
                                      ...s.style,
                                      fontSize: Number(e.target.value),
                                    },
                                  }
                                : s
                            );
                            setSubtitles(updatedSubtitles);
                          }}
                          className="w-full px-2 py-1 rounded bg-sidebar border border-input"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm mb-1">Color</label>
                        <input
                          type="color"
                          value={subtitle.style.color}
                          onChange={(e) => {
                            const updatedSubtitles = subtitles.map((s) =>
                              s.id === subtitle.id
                                ? {
                                    ...s,
                                    style: {
                                      ...s.style,
                                      color: e.target.value,
                                    },
                                  }
                                : s
                            );
                            setSubtitles(updatedSubtitles);
                          }}
                          className="w-full h-8 rounded bg-sidebar border border-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}