import { create } from "zustand";
import { generateRoute } from "../services/route.service";

export const useRouteStore = create((set) => ({
  route: [],
  summary: null,
  loading: false,
  error: null,

  generateOptimizedRoute: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await generateRoute(payload);

      const routeData = res.data || [];

      const totalTime = routeData.reduce(
        (sum, p) => sum + (p.averageTimeSpent || 0),
        0
      );

      set({
        route: routeData,
        summary: {
          totalStops: routeData.length,
          totalTime,
          totalDistance: routeData.length
            ? routeData[routeData.length - 1]?.distanceFromPrevious || 0
            : 0,
          days: totalTime > 480 ? 2 : 1, // simple logic (8 hrs/day)
        },
        loading: false,
      });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },
}));
