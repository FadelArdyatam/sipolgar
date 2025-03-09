import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { NutritionData, NutritionSummary } from "../../types/nutrition"
import { fetchNutritionDataService, fetchNutritionSummaryService } from "../../services/nutritionService"

interface NutritionState {
  nutritionData: NutritionData | null
  nutritionSummary: NutritionSummary
  loading: boolean
  error: string | null
}

const initialState: NutritionState = {
  nutritionData: null,
  nutritionSummary: {
    consumedCalories: 0,
    targetCalories: 2000,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  },
  loading: false,
  error: null,
}

export const fetchNutritionData = createAsyncThunk("nutrition/fetchNutritionData", async () => {
  const data = await fetchNutritionDataService()
  return data
})

export const fetchNutritionSummary = createAsyncThunk("nutrition/fetchNutritionSummary", async () => {
  const data = await fetchNutritionSummaryService()
  return data
})

const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutritionData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNutritionData.fulfilled, (state, action: PayloadAction<NutritionData>) => {
        state.loading = false
        state.nutritionData = action.payload
      })
      .addCase(fetchNutritionData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch nutrition data"
      })
      .addCase(fetchNutritionSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNutritionSummary.fulfilled, (state, action: PayloadAction<NutritionSummary>) => {
        state.loading = false
        state.nutritionSummary = action.payload
      })
      .addCase(fetchNutritionSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch nutrition summary"
      })
  },
})

export default nutritionSlice.reducer

