import {create} from 'zustand';

interface IBook {
    isLogged: boolean
    id: string
    firstname: string
    company_id: string
}

export const userDataStore2 = create<IBook>( (set) => ({
    // initial state
    isLogged: false,
    id: '',
    firstname: '',
    company_id: '',



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
          id: '',
          firstname: '',
          company_id: '',
        })),




})

);

export default userDataStore2;