import { createSlice } from '@reduxjs/toolkit';

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lang') || 'eng';
  }
  return 'eng';
};

const langSlice = createSlice({
  name: 'lang',
  initialState: getInitialLang(),
  reducers: {
    setLanguage: (state, action) => {
      localStorage.setItem('lang', action.payload);
      return action.payload;
    }
  }
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;