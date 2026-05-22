import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadPdf = createAsyncThunk(
  'pdf/uploadPdf',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const { data } = await axios.post('/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Upload failed');
    }
  }
);

export const extractPages = createAsyncThunk(
  'pdf/extractPages',
  async ({ id, pages }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/pdf/${id}/extract`, { pages }, { responseType: 'blob' });
      return response.data;
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try { return rejectWithValue(JSON.parse(text).message || 'Extraction failed'); }
        catch { return rejectWithValue('Extraction failed'); }
      }
      return rejectWithValue(err.response?.data?.message || err.message || 'Extraction failed');
    }
  }
);


const initialState ={
    fileInfo:null,
    uploadStatus:'idle',
    uploadError:null,
    selectedPages:[],
    extractBlob:null,
    extractStatus:'idle',
    extractError:null,
    toast:null
}

const pdfSlice = createSlice({
    name:'pdf',
    initialState,
    reducers:{
       togglePage(state,action){
        const idx=state.selectedPages.indexOf(action.payload)
        if(idx>=0) state.selectedPages.splice(idx,1)
        else state.selectedPages.push(action.payload)
       },
       selectAll(state){
        if(!state.fileInfo) return 
        state.selectPages=Array.from({length:state.fileInfo.pageCount},(_,i)=>i)
       },
    deselectAll(state) { state.selectedPages = []; },
    reorderPages(state, action) { state.selectedPages = action.payload; },
    clearExtracted(state) { state.extractedBlob = null; state.extractStatus = 'idle'; },
    resetAll() { return initialState; },
    showToast(state, action) { state.toast = action.payload; },
    dismissToast(state) { state.toast = null; },
    },
    extraReducers: (builder) => {
    builder
      .addCase(uploadPdf.pending, (state) => { state.uploadStatus = 'loading'; state.uploadError = null; })
      .addCase(uploadPdf.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.fileInfo = action.payload;
        state.toast = { type: 'success', message: `Uploaded "${action.payload.filename}" — ${action.payload.pageCount} pages` };
      })
      .addCase(uploadPdf.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload;
        state.toast = { type: 'error', message: action.payload };
      })
      .addCase(extractPages.pending, (state) => { state.extractStatus = 'loading'; state.extractError = null; })
      .addCase(extractPages.fulfilled, (state, action) => {
        state.extractStatus = 'succeeded';
        state.extractedBlob = action.payload;
        state.toast = { type: 'success', message: 'PDF created! Starting download...' };
      })
      .addCase(extractPages.rejected, (state, action) => {
        state.extractStatus = 'failed';
        state.extractError = action.payload;
        state.toast = { type: 'error', message: action.payload };
      });
  },
})

export const { togglePage, selectAll, deselectAll, reorderPages, clearExtracted, resetAll, showToast, dismissToast } = pdfSlice.actions;
export default pdfSlice.reducer;