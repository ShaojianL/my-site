/**
 * Single source of truth for application route paths.
 * Import from here instead of hard-coding URL strings.
 */
export const AppRoutes = {
  home: "/",
  activitiesSelection: "/activities_selection",
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
