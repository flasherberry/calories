'use client';

import { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { captureImage } from '@/utils/camera';
import { analyzeFoodImage } from '@/utils/openai';
import { NutritionInfo } from '@/types';

interface CameraCaptureProps {
  onFoodAnalyzed: (nutritionInfo: NutritionInfo, imageBase64: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onFoodAnalyzed, onClose }: CameraCaptureProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const imageBase64 = await captureImage();
      const nutritionInfo = await analyzeFoodImage(imageBase64);
      
      onFoodAnalyzed(nutritionInfo, imageBase64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        
        const nutritionInfo = await analyzeFoodImage(base64Data);
        onFoodAnalyzed(nutritionInfo, base64Data);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add Food</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Camera size={20} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Take Photo'}</span>
          </button>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isAnalyzing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              disabled={isAnalyzing}
              className="w-full bg-gray-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Upload size={20} />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600 mt-2">Analyzing your food...</p>
          </div>
        )}
      </div>
    </div>
  );
}