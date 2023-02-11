

import {create} from "zustand";
import { persist } from "zustand/middleware";

const useDataStore = create(
  persist(
    (set) => ({
      // initial state
      isLogged: false,
      id: null,
      firstname: null,
      company_id: null,


      // methods for manipulating state
      authLogin: (
        isLogged: boolean,
        id: string,
        firstname: string,
        company_id: string,
        
      ) =>
        set((state: any) => ({
          isLogged: isLogged,
          id: id,
          firstname: firstname,
          company_id: company_id,

        })),
      authLogout: () =>
        set((state: any) => ({
          isLogged: false,
          id: null,
          firstname: null,
          company_id: null,
        })),
    }),
    {
      name: "userLog", // unique name
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
);

export default useDataStore;