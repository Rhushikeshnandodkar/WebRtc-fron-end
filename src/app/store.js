import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,  // Ensure you're passing the reducer correctly
  },
});

export default store;
