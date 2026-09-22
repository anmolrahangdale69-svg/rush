import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, RefreshCw, X, Image as ImageIcon } from 'lucide-react';

export const LogoUploadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          throw new Error('Failed to read image file');
        }

        const isLikelyScreenshot = file.name.toLowerCase().includes('screenshot') ||
          file.name.toLowerCase().includes('whatsapp') ||
          file.size > 500000;

        const res = await fetch('/api/upload-logo-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl,
            cropWindow: isLikelyScreenshot,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to upload logo');
        }

        setStatus('success');
        setPreviewSrc(`/api/logo?t=${Date.now()}`);
        window.dispatchEvent(new Event('bokde-logo-updated'));
        setIsUploading(false);
      };

      reader.onerror = () => {
        throw new Error('Could not read the selected file.');
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred during upload.');
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      {/* Floating button visible in the preview */}
      <div className="fixed bottom-24 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-900/95 hover:bg-stone-900 text-amber-400 hover:text-amber-300 rounded-full shadow-xl border border-amber-500/40 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Upload or update official Bokde Travels logo"
        >
          <Upload className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Set Official Logo</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg leading-tight">
                  Official Bokde Travels Logo
                </h3>
                <p className="text-xs text-stone-500">
                  Select your original WhatsApp image or screenshot
                </p>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 border-2 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/40 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-700 mx-auto flex items-center justify-center mb-3 transition-colors">
                <Upload className="w-6 h-6" />
              </div>

              <p className="font-semibold text-stone-800 text-sm mb-1">
                Click to browse or drag file here
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Supports WhatsApp images, PNG, JPEG, or Mac screenshots containing the logo
              </p>
            </div>

            {/* Status Feedback */}
            {isUploading && (
              <div className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 text-amber-900 rounded-xl text-sm font-medium border border-amber-200">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>Processing & applying official logo...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Official Logo Applied Everywhere!</span>
                </div>
                {previewSrc && (
                  <div className="p-3 bg-white rounded-lg border border-emerald-100 flex items-center justify-center">
                    <img
                      src={previewSrc}
                      alt="Updated Logo Preview"
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-emerald-700 mt-2 text-center">
                  The header, mobile navigation, and footer are now updated with this exact file.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
