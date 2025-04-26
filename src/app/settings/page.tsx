'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import SideNav from '@/components/SideNav';

interface VideoQualitySettings {
  resolution: string;
  bitrate: string;
  frameRate: string;
}

interface ExportSettings {
  format: string;
  quality: string;
  destination: string;
}

interface KeyboardShortcut {
  action: string;
  shortcut: string;
}

export default function SettingsPage() {
  const [videoQuality, setVideoQuality] = useState<VideoQualitySettings>({
    resolution: '1080p',
    bitrate: '8000',
    frameRate: '30',
  });

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'mp4',
    quality: 'high',
    destination: 'downloads',
  });

  const [theme, setTheme] = useState('system');

  const [shortcuts] = useState<KeyboardShortcut[]>([
    { action: 'Play/Pause', shortcut: 'Space' },
    { action: 'Split Clip', shortcut: 'S' },
    { action: 'Delete Clip', shortcut: 'Delete' },
    { action: 'Undo', shortcut: 'Ctrl+Z' },
    { action: 'Redo', shortcut: 'Ctrl+Y' },
  ]);

  const handleSaveSettings = () => {
    // In a real app, this would persist settings to backend/localStorage
    console.log('Saving settings:', { videoQuality, exportSettings, theme });
  };

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <button
              onClick={handleSaveSettings}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
          
          {/* Video Quality Settings */}
          <div className="bg-card rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Video Quality</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resolution</label>
                <select
                  value={videoQuality.resolution}
                  onChange={(e) => setVideoQuality({ ...videoQuality, resolution: e.target.value })}
                  className="w-full px-4 appearance-none py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="1440p">1440p</option>
                  <option value="2160p">2160p (4K)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bitrate (kbps)</label>
                <input
                  type="number"
                  value={videoQuality.bitrate}
                  onChange={(e) => setVideoQuality({ ...videoQuality, bitrate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-sidebar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Frame Rate (fps)</label>
                <select
                  value={videoQuality.frameRate}
                  onChange={(e) => setVideoQuality({ ...videoQuality, frameRate: e.target.value })}
                  className="w-full px-4 appearance-none py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="24">24</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Export Settings */}
          <div className="bg-card rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Export Settings</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select
                  value={exportSettings.format}
                  onChange={(e) => setExportSettings({ ...exportSettings, format: e.target.value })}
                  className="w-full px-4 appearance-none py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="mov">MOV</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quality</label>
                <select
                  value={exportSettings.quality}
                  onChange={(e) => setExportSettings({ ...exportSettings, quality: e.target.value })}
                  className="w-full px-4 appearance-none py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Default Save Location</label>
                <select
                  value={exportSettings.destination}
                  onChange={(e) => setExportSettings({ ...exportSettings, destination: e.target.value })}
                  className="w-full px-4 appearance-none py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="downloads">Downloads Folder</option>
                  <option value="documents">Documents Folder</option>
                  <option value="custom">Custom Location</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Theme Settings */}
          <div className="bg-card rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Theme</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Color Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 appearance-none py-2 rounded-lg border border-input bg-sidebar"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          
          {/* Keyboard Shortcuts */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
            <div className="grid gap-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span>{shortcut.action}</span>
                  <kbd className="px-3 py-1 rounded bg-accent text-accent-foreground font-mono text-sm">
                    {shortcut.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}