'use client';

import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Clock, Settings } from 'lucide-react';
import { UserGoal, DayData, Meal, NutritionInfo } from '@/types';
import { getDayData, getTodayString, getUserGoal } from '@/utils/storage';
import CameraCapture from './CameraCapture';
import MealLogger from './MealLogger';

interface DashboardProps {
  userGoal: UserGoal;
  onEditGoal: () => void;
}

export default function Dashboard({ userGoal, onEditGoal }: DashboardProps) {
  const [todayData, setTodayData] = useState<DayData | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [currentNutritionInfo, setCurrentNutritionInfo] = useState<NutritionInfo | null>(null);
  const [currentImageBase64, setCurrentImageBase64] = useState<string>('');

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = () => {
    const today = getTodayString();
    const data = getDayData(today);
    setTodayData(data || { date: today, meals: [], totalCalories: 0 });
  };

  const handleFoodAnalyzed = (nutritionInfo: NutritionInfo, imageBase64: string) => {
    setCurrentNutritionInfo(nutritionInfo);
    setCurrentImageBase64(imageBase64);
    setShowCamera(false);
    setShowMealLogger(true);
  };

  const handleMealSaved = (meal: Meal) => {
    loadTodayData();
    setShowMealLogger(false);
    setCurrentNutritionInfo(null);
    setCurrentImageBase64('');
  };

  const handleMealCancel = () => {
    setShowMealLogger(false);
    setCurrentNutritionInfo(null);
    setCurrentImageBase64('');
  };

  const remainingCalories = userGoal.dailyCalories - (todayData?.totalCalories || 0);
  const progressPercentage = Math.min(((todayData?.totalCalories || 0) / userGoal.dailyCalories) * 100, 100);
  
  const getMealsByType = (type: string) => {
    return todayData?.meals.filter(meal => meal.type === type) || [];
  };

  const mealTypes = [
    { type: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { type: 'lunch', label: 'Lunch', emoji: '☀️' },
    { type: 'dinner', label: 'Dinner', emoji: '🌙' },
    { type: 'snack', label: 'Snacks', emoji: '🍎' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Today's Progress</h1>
            <button
              onClick={onEditGoal}
              className="text-white hover:text-blue-200"
            >
              <Settings size={24} />
            </button>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2">
              {todayData?.totalCalories || 0}
            </div>
            <div className="text-blue-100">
              of {userGoal.dailyCalories} calories
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-blue-400 rounded-full h-3 mb-4">
            <div
              className="bg-white rounded-full h-3 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-lg font-semibold">{Math.max(remainingCalories, 0)}</div>
              <div className="text-xs text-blue-100">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{userGoal.type}</div>
              <div className="text-xs text-blue-100">Goal</div>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="p-6 space-y-4">
          {mealTypes.map(({ type, label, emoji }) => {
            const meals = getMealsByType(type);
            const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

            return (
              <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{emoji}</span>
                    <h3 className="font-semibold text-gray-800">{label}</h3>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {totalCalories} cal
                  </span>
                </div>

                {meals.length > 0 ? (
                  <div className="space-y-2">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        {meal.image && (
                          <img
                            src={`data:image/jpeg;base64,${meal.image}`}
                            alt={meal.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{meal.name}</div>
                          <div className="text-sm text-gray-600">{meal.calories} cal</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(meal.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-sm">No {label.toLowerCase()} logged yet</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Meal Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowCamera(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <CameraCapture
            onFoodAnalyzed={handleFoodAnalyzed}
            onClose={() => setShowCamera(false)}
          />
        )}

        {/* Meal Logger Modal */}
        {showMealLogger && currentNutritionInfo && (
          <MealLogger
            nutritionInfo={currentNutritionInfo}
            imageBase64={currentImageBase64}
            onSave={handleMealSaved}
            onCancel={handleMealCancel}
          />
        )}
      </div>
    </div>
  );
}