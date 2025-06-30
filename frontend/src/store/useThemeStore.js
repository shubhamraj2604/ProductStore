//zustand
import {create} from 'zustand';

export const useThemeStore = create((set) => ({     // we are returning an object
 theme:localStorage.getItem("preferred-theme") || "forest",                                  
 setTheme : (theme) =>{
    localStorage.setItem("preferred-theme", theme);
    set({theme: theme});
 }
}))