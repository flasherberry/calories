'use client';

import { useState, useEffect } from 'react';
import { UserGoal } from '@/types';
import { getUserGoal } from '@/utils/storage';
import GoalSetup from '@/components/GoalSetup';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const goal = getUserGoal();
    setUserGoal(goal);
    setIsLoading(false);
  }, []);

  const handleGoalComplete = (goal: UserGoal) => {
    setUserGoal(goal);
  };

  const handleEditGoal = () => {
    setUserGoal(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userGoal) {
    return <GoalSetup onComplete={handleGoalComplete} />;
  }

  return <Dashboard userGoal={userGoal} onEditGoal={handleEditGoal} />;
}
