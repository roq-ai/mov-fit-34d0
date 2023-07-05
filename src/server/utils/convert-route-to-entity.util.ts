const mapping: Record<string, string> = {
  exercises: 'exercise',
  media: 'media',
  users: 'user',
  workouts: 'workout',
  'workout-ers': 'workout_er',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
