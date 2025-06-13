'use client';

import { useState } from 'react';
import { Check, Edit2, X } from 'lucide-react';
import { NutritionInfo, Meal } from '@/types';
import { addMealToDay, getTodayString } from '@/utils/storage';

interface MealLoggerProps {
  nutritionInfo: NutritionInfo;
  imageBase64: string;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

export default function MealLogger({ nutritionInfo, imageBase64, onSave, onCancel }: MealLoggerProps) {
  const [name, setName] = useState(nutritionInfo.name);
  const [calories, setCalories] = useState(nutritionInfo.calories.toString());
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const meal: Meal = {
      id: Date.now().toString(),
      name,
      calories: parseInt(calories) || 0,
      image: imageBase64,
      timestamp: new Date(),
      type: mealType
    };

    addMealToDay(getTodayString(), meal);
    onSave(meal);
  };

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' }
  ];

  const confidenceColor = nutritionInfo.confidence > 0.7 ? 'text-green-600' : 
                         nutritionInfo.confidence > 0.4 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirm Meal</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {imageBase64 && (
          <div className="mb-4">
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Food"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setMealType(type.value as any)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    mealType === type.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg mb-1">{type.emoji}</div>
                  <div className="text-xs font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Food Name
              </label>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Edit2 size={16} />
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories
            </label>
            {isEditing ? (
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-2xl font-bold text-gray-800">{calories} cal</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI Confidence</span>
              <span className={`text-sm font-medium ${confidenceColor}`}>
                {Math.round(nutritionInfo.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  nutritionInfo.confidence > 0.7 ? 'bg-green-500' :
                  nutritionInfo.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${nutritionInfo.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check size={20} />
              <span>Save Meal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}