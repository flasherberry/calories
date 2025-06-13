'use client';

import { useState } from 'react';
import { UserGoal } from '@/types';
import { calculateDailyCalorieGoal } from '@/utils/openai';
import { saveUserGoal } from '@/utils/storage';

interface GoalSetupProps {
  onComplete: (goal: UserGoal) => void;
}

export default function GoalSetup({ onComplete }: GoalSetupProps) {
  const [goalType, setGoalType] = useState<'lose' | 'gain' | 'maintain'>('maintain');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('');
  const [useCustomCalories, setUseCustomCalories] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let dailyCalories: number;
    
    if (useCustomCalories && customCalories) {
      dailyCalories = parseInt(customCalories);
    } else {
      const current = parseFloat(currentWeight) || 70;
      const target = parseFloat(targetWeight) || current;
      dailyCalories = calculateDailyCalorieGoal(current, target, goalType);
    }
    
    const goal: UserGoal = {
      type: goalType,
      dailyCalories,
      currentWeight: parseFloat(currentWeight) || undefined,
      targetWeight: parseFloat(targetWeight) || undefined
    };
    
    saveUserGoal(goal);
    onComplete(goal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Set Your Goal
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What&apos;s your goal?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'lose', label: 'Lose Weight', emoji: '📉' },
                { value: 'maintain', label: 'Maintain', emoji: '⚖️' },
                { value: 'gain', label: 'Gain Weight', emoji: '📈' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGoalType(option.value as 'lose' | 'gain' | 'maintain')}
                  className={`p-3 rounded-xl text-center transition-all ${
                    goalType === option.value
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {!useCustomCalories && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="70"
                />
              </div>

              {goalType !== 'maintain' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="65"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="customCalories"
              checked={useCustomCalories}
              onChange={(e) => setUseCustomCalories(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="customCalories" className="text-sm text-gray-700">
              Set custom daily calorie goal
            </label>
          </div>

          {useCustomCalories && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calorie Goal
              </label>
              <input
                type="number"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Start Tracking
          </button>
        </form>
      </div>
    </div>
  );
}