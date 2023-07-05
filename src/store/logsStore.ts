

import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const logsStore = create(
  persist(
    (set) => ({
      // initial state
      logApp: "",
      
      // methods for manipulating state
      logCatcher: (
        logApp: string,
        
      ) =>
        set((state: any) => ({
          logApp: logApp,

        })),
        clearLogCatcher: () =>
        set((state: any) => ({
          logApp: null,
          
        })),
    }),
    {
      name: "logs", // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
);

export default logsStore;