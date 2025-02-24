import { configureStore } from "@reduxjs/toolkit";
import themeSlice from '../Redux/Slices/themeSlice.js';


export const store = configureStore({
    reducer:{
        theme: themeSlice
    }
})