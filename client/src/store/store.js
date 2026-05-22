import { configureStore } from '@reduxjs/toolkit';
import pdfReducer from './pdfSlice';

export const store = configureStore({
  reducer: { pdf: pdfReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['pdf/extractPages/fulfilled'],
        ignoredPaths: ['pdf.extractedBlob'],
      },
    }),
});
