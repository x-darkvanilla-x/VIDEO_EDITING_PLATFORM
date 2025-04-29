'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [exportSettings, setExportSettings] = useState({
    format: 'mp4',
    quality: 'high',
    destination: 'downloads'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isExporting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsExporting(false);
            setShowSuccess(true);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isExporting]);

  const handleExport = () => {
    setIsExporting(true);
    setProgress(0);
    setShowSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors"
        >
          <X size={20} />
        </button>

        {!isExporting && !showSuccess ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Export Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select
                  value={exportSettings.format}
                  onChange={(e) => setExportSettings({ ...exportSettings, format: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-sidebar"
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
                  className="w-full px-4 py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Save Location</label>
                <select
                  value={exportSettings.destination}
                  onChange={(e) => setExportSettings({ ...exportSettings, destination: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-sidebar"
                >
                  <option value="downloads">Downloads Folder</option>
                  <option value="documents">Documents Folder</option>
                  <option value="custom">Custom Location</option>
                </select>
              </div>

              <button
                onClick={handleExport}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6"
              >
                Export
              </button>
            </div>
          </>
        ) : isExporting ? (
          <div className="py-8">
            <h2 className="text-xl font-semibold mb-6 text-center">Exporting Video...</h2>
            <div className="w-full bg-accent rounded-full h-4 mb-4">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-muted-foreground">{progress}% Complete</p>
          </div>
        ) : (
          <div className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-green-500">Export Complete!</h2>
            <p className="text-muted-foreground mb-6">Your video has been exported successfully.</p>
            <button
              onClick={onClose}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}