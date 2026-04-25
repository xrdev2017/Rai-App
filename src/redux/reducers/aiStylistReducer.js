import { createSlice } from "@reduxjs/toolkit";

const aiStylistReducer = createSlice({
  name: "aiStylist",
  initialState: {
    lastVtoResult: {
      originalImage: null,
      resultImage: null,
      outfitImageUrl: null,
      outfitId: null,
    },
  },
  reducers: {
    setLastVtoResult: (state, action) => {
      state.lastVtoResult = action.payload;
    },
    updateVtoOutfit: (state, action) => {
      if (state.lastVtoResult) {
        state.lastVtoResult.outfitImageUrl = action.payload;
      }
    },
    clearVtoResult: (state) => {
      state.lastVtoResult = {
        originalImage: null,
        resultImage: null,
        outfitImageUrl: null,
        outfitId: null,
      };
    },
  },
});

export const { setLastVtoResult, updateVtoOutfit, clearVtoResult } = aiStylistReducer.actions;

export default aiStylistReducer.reducer;
