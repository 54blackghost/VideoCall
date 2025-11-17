import React from 'react'
import {create} from 'zustand'

 const useThemeStore = create ((set) => ({
    theme: localStorage.getItem("streamity-theme") || "coffee",
    setTheme: (theme)=> {
        localStorage.setItem("streamifi-theme", theme);
        set({theme});
    },
}));


export default useThemeStore;

