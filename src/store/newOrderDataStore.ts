

import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const newOrderDataStore = create(
  persist(
    (set) => ({
      // initial state
      lockerId: null,
      location: null,
      bookingSlotId: null,
      companyId: null,
      companyName: null,
      lockerType: null,
      delivererId: null,
      tempZone: null,
      keyTemp: null,
      slotSize: null,
      numberCart: 0,
      ageRestriction: null,

     
      // methods for manipulating state
      newOrderRegister: (
        
        lockerId: string,
        location: string,
        bookingSlotId: string,
        companyId: number,
        companyName: string,
        lockerType: number,
        delivererId: number,
        tempZone: string,
        keyTemp: string,
        slotSize: string,
        numberCart: number,
        ageRestriction: number,
      ) =>
        set((state: any) => ({
          lockerId: lockerId,
          location: location,
          bookingSlotId: bookingSlotId,
          companyId: companyId,
          companyName: companyName,
          lockerType: lockerType,
          delivererId: delivererId,
          tempZone: tempZone,
          keyTemp: keyTemp,
          slotSize: slotSize,
          numberCart: numberCart,
          ageRestriction: ageRestriction,
        })),
      newOrderDelete: () =>
        set((state: any) => ({
          lockerId: null,
          location: null,
          bookingSlotId: null,
          companyId: null,
          companyName: null,
          lockerType: null,
          delivererId: null,
          tempZone: null,
          keyTemp: null,
          slotSize: null,
          numberCart: null,
          ageRestriction: null,
        })),
    }),
    {
      name: 'new-order', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
)

export default newOrderDataStore;