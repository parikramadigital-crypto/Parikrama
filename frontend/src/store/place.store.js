import { create } from "zustand";
import {
  getAllPlaces,
  getPlacesByCity,
  getPlaceById,
} from "../services/place.service";

export const usePlaceStore = create((set) => ({
  places: [],
  selectedPlace: null,
  loading: false,
  error: null,

  fetchAllPlaces: async () => {
    try {
      set({ loading: true });
      const res = await getAllPlaces();
      set({ places: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchPlacesByCity: async (cityId) => {
    try {
      set({ loading: true });
      const res = await getPlacesByCity(cityId);
      set({ places: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchPlaceById: async (id) => {
    try {
      set({ loading: true });
      const res = await getPlaceById(id);
      set({ selectedPlace: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },
}));
