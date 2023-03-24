

import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const userDataStore = create(
  persist(
    (set) => ({
      // initial state
      isLogged: false,
      id: null,
      firstname: null,
      company_id: null,
      company_name: null,
      token: null,


      // methods for manipulating state
      authLogin: (
        isLogged: boolean,
        id: string,
        firstname: string,
        company_id: number,
        company_name: string,
        token: any,
        
      ) =>
        set((state: any) => ({
          isLogged: isLogged,
          id: id,
          firstname: firstname,
          company_id: company_id,
          company_name: company_name,
          token: token,

        })),
      authLogout: () =>
        set((state: any) => ({
          isLogged: false,
          id: null,
          firstname: null,
          company_id: null,
          company_name: null,
          token: null,
        })),
    }),
    {
      name: "userLog", // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
);

export default userDataStore;