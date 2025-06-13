export interface Meal {
  id: string;
  name: string;
  calories: number;
  image?: string;
  timestamp: Date;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface UserGoal {
  type: 'lose' | 'gain' | 'maintain';
  dailyCalories: number;
  currentWeight?: number;
  targetWeight?: number;
}

export interface DayData {
  date: string;
  meals: Meal[];
  totalCalories: number;
}

export interface NutritionInfo {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  confidence: number;
}