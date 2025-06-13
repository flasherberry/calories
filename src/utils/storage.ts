import { UserGoal, DayData, Meal } from '@/types';

const STORAGE_KEYS = {
  USER_GOAL: 'calorie_tracker_user_goal',
  DAILY_DATA: 'calorie_tracker_daily_data'
};

export function saveUserGoal(goal: UserGoal): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_GOAL, JSON.stringify(goal));
  }
}

export function getUserGoal(): UserGoal | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_GOAL);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function saveDayData(dayData: DayData): void {
  if (typeof window !== 'undefined') {
    const allData = getAllDayData();
    allData[dayData.date] = dayData;
    localStorage.setItem(STORAGE_KEYS.DAILY_DATA, JSON.stringify(allData));
  }
}

export function getDayData(date: string): DayData | null {
  if (typeof window !== 'undefined') {
    const allData = getAllDayData();
    return allData[date] || null;
  }
  return null;
}

export function getAllDayData(): Record<string, DayData> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_DATA);
    return stored ? JSON.parse(stored) : {};
  }
  return {};
}

export function addMealToDay(date: string, meal: Meal): void {
  let dayData = getDayData(date);
  
  if (!dayData) {
    dayData = {
      date,
      meals: [],
      totalCalories: 0
    };
  }
  
  dayData.meals.push(meal);
  dayData.totalCalories = dayData.meals.reduce((sum, m) => sum + m.calories, 0);
  
  saveDayData(dayData);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}