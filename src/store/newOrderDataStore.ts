

import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const newOrderDataStore = create(
  persist(
    (set) => ({
      // initial state
      lockerId: null,
      location: null,
      companyId: null,
      companyName: null,
      lockerType: null,
      delivererId: null,
      tempZone: null,
      slotSize: null,
      numberCart: 0,

     
      // methods for manipulating state
      newOrderRegister: (
      
        lockerId: string,
        location: string,
        companyId: number,
        companyName: string,
        lockerType: number,
        delivererId: number,
        tempZone: string,
        slotSize: string,
        numberCart: number,
      ) =>
        set((state: any) => ({
          lockerId: lockerId,
          location: location,
          companyId: companyId,
          companyName: companyName,
          lockerType: lockerType,
          delivererId: delivererId,
          tempZone: tempZone,
          slotSize: slotSize,
          numberCart: numberCart,
        })),
      newOrderDelete: () =>
        set((state: any) => ({
          lockerId: null,
          location: null,
          companyId: null,
          companyName: null,
          lockerType: null,
          delivererId: null,
          tempZone: null,
          slotSize: null,
          numberCart: null,
        })),
    }),
    {
      name: 'new-order', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
)

export default newOrderDataStore;