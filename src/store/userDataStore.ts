

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
      cleveronCompany_id: null,
      company_name: null,
      token: null,
      subToken: null,
      apm_access_code: null,


      // methods for manipulating state
      authLogin: (
        isLogged: boolean,
        id: string,
        firstname: string,
        company_id: number,
        cleveronCompany_id: string,
        company_name: string,
        token: any,
        subToken: any,
        apm_access_code: any,
        
      ) =>
        set((state: any) => ({
          isLogged: isLogged,
          id: id,
          firstname: firstname,
          company_id: company_id,
          cleveronCompany_id: cleveronCompany_id,
          company_name: company_name,
          token: token,
          subToken: subToken,
          apm_access_code: apm_access_code,

        })),
      authLogout: () =>
        set((state: any) => ({
          isLogged: false,
          id: null,
          firstname: null,
          company_id: null,
          cleveronCompany_id: null,
          company_name: null,
          token: null,
          subToken: null,
          apm_access_code: null,
        })),
    }),
    {
      name: "userLog", // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
);

export default userDataStore;