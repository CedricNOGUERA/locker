

import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const bookingStore = create(
  persist(
    (set) => ({
      // initial state
      bookingData: [],

     
      // methods for manipulating state
      bookingSet: (
      
        bookingData: any,
      ) =>
        set((state: any) => ({
          bookingData: bookingData,
        })),
      bookingRemove: () =>
        set((state: any) => ({
          bookingData: [],
        })),
    }),
    {
      name: 'booking', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
)

export default bookingStore;