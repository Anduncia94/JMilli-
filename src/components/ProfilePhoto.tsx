import React, { useState, useRef } from 'react';
import { Camera, Upload, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ProfilePhotoProps = {
  userId: string;
  photoUrl?: string | null;
  onPhotoUpdate: (url: string) => void;
};

export default function ProfilePhoto({ userId, photoUrl, onPhotoUpdate }: ProfilePhotoProps) {
  const [uploading, setUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);
      setShowMenu(false);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('client_profiles')
        .update({ profile_photo_url: data.publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      onPhotoUpdate(data.publicUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      setShowCamera(true);
      setShowMenu(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          stopCamera();
          await uploadPhoto(file);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <>
      <div className="relative group">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-2xl shadow-gray-900/30 dark:shadow-gray-100/30 overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-14 h-14 text-white dark:text-gray-900" />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          disabled={uploading}
        >
          <Camera className="w-5 h-5 text-white" />
        </button>

        {showMenu && (
          <div className="absolute top-full left-0 mt-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-10 min-w-[200px]">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left"
            >
              <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Upload Photo</span>
            </button>
            <button
              onClick={startCamera}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left border-t border-gray-200 dark:border-gray-700"
            >
              <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Take Photo</span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Take Photo</h3>
              <button
                onClick={stopCamera}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="relative rounded-3xl overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
            </div>

            <button
              onClick={capturePhoto}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
