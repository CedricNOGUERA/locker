import OrdersService from "../service/Orders/OrdersService";
import freeze from '../styles/Fatcow-Farm-Fresh-Temperature-cold.32.webp'
import fresh from '../styles/Fatcow-Farm-Fresh-Temperature-normal.32.webp'
import normal from '../styles/Fatcow-Farm-Fresh-Temperature-hot.32.webp'

export const _successNotif = (id: any, messageApi: any, setSelectedOrder: any) => {
    messageApi.open({
      type: 'success',
      content: `Commande # ${id} déposée`,
      duration: 2.2,
    });
    setSelectedOrder("")
  };
  
  export const _errorNotif = (id: any, messageApi: any, setSelectedOrder: any) => {
      messageApi.open({
        type: 'error',
        content: `Une erreur s'est produite`,
        duration: 2.2,
      });
      setSelectedOrder("")
    };



  /********************************
  * Search order by num (barcode)
  *******************************/

  export const _searchWithRegex = (searchOrder: any, orderByStatus: any, setFilteredOrder: any ) => {
    function escapeRegExp(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    const escapedSearchOrder = escapeRegExp(searchOrder);
  
    setFilteredOrder(orderByStatus?.filter((order: any) => {
      if (escapedSearchOrder.length > 1) {
        return order?.barcode?.match(new RegExp(escapedSearchOrder, "i")) || order?.externalOrderId?.match(new RegExp(escapedSearchOrder, "i"));
      }
        return false;
    }))
  }
  /********************************
  * Search by regex 
  *******************************/

  export const _searchAnythingWithRegex = (searchValue: any, data: any, setFilteredOrder: any, searchField: any  ) => {
    function escapeRegExp(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    const escapedSearchValue  = escapeRegExp(searchValue);
    setFilteredOrder(data?.filter((order: any) => {
      if (escapedSearchValue.length > 2) {

        return order?.[searchField]?.match(new RegExp(escapedSearchValue , "i"));
      }
        return undefined;
      

    }))
  }


   /********************************
   * Change order status
   *******************************/

  export const _updateStatus = (id: any, orderData: any, setOrderData: any, messageApi: any, setSelectedOrder: any,  newStatus: any ) => {
    const indx = orderData?.["hydra:member"]?.findIndex((order: any) => order.id === id);
    const filteredOrder = orderData?.["hydra:member"]?.filter((order: any) => order.id === id);

   
    const newTab = [...orderData?.["hydra:member"]];
   
    newTab[indx] = newStatus;
    
    setOrderData(newTab);

    _successNotif(filteredOrder[0].id, messageApi, setSelectedOrder);

    if (filteredOrder?.length > 0) {
      _successNotif(filteredOrder[0].id, messageApi, setSelectedOrder);
    } else {
      _errorNotif(filteredOrder[0].id, messageApi, setSelectedOrder);
    }
  };

  export const _UpdateStatus = (id: any, token: any, data: any) => {
    OrdersService.update(id, token, data).then((response: any) => {
        console.log(response)
    })


  }
/////////////////////////////////
// msg retour après un scan 
/////////////////////////////////

  export const _getScanMsg = (status: any, msg: any) => {
    if (status === 'created') {
      return "Cette commande est toujours en préparation"
    }else if (status === 'picked_up') {
      return "Cette commande est déjà prise en charge"
    }else if (status === 'operin') {
      return `Cette commande a déjà été déposée par ${msg}`
    } else if (status === 'reminder') {
      return "Cette commande en 1er Rappel"
    } else if (status === 'overtimedue') {
      return "Cette commande est en 2è Rappel"
    } else if (status === 'overtime') {
      return "Cette commande est expirée"
    } else if (status === 'operout') {
      return `Cette commande a été sortie par le coursier ${{msg}}`
    } else if (status === 'receive') {
      return "Cette commande a été récupérée le client"
    } else if (status === 'left_for_customer_service') {
      return "Cette commande a été déposée au service client"
    } else if (status === 'return') {
      return "Retour???"
    } else{
      return "Cette commande n'existe pas"
    }
    
  }


/////////////////////////////////
// retourne le status en français
/////////////////////////////////

  export const _getStatus = (status: any) => {
    if (status === 'created') {
      return "Création"
    }else if (status === 'ready_for_delivery') {
      return "Prête à l'envoi"
    }else if (status === 'picked_up') {
      return "En livraison"
    }else if (status === 'operin') {
      return "Déposée"
    } else if (status === 'reminder') {
      return "1er Rappel"
    } else if (status === 'overtimedue') {
      return "2è Rappel"
    } else if (status === 'overtime') {
      return "Expirée"
    } else if (status === 'operout') {
      return "Sortie par le coursier"
    } else if (status === 'receive') {
      return "Récupérée"
    } else if (status === 'left_for_customer_service') {
      return "Service client"
    } else if (status === 'return') {
      return "Retour"
    }
  }




/////////////////////////////////
// Message en fonction du status
/////////////////////////////////

  export const _getStatusMsg = (status: any) => {
    if (status === 'created') {
      return "Commande créée"
    } else if (status === 'ready_for_delivery') {
      return "Commande préparée et mise à disposition du coursier"
    }  else if (status === 'picked_up') {
      return "Commande en cours de livraison"
    }  else if (status === 'operin') {
      return "Commande déposée par le coursier"
    } else if (status === 'reminder') {
      return "Rappel d'une commande non récupérée depuis un certain temps"
    } else if (status === 'overtimedue') {
      return "Commande non récupérée et proche de l'expiration"
    } else if (status === 'overtime') {
      return "Commande non récupérée et expiré"
    } else if (status === 'operout') {
      return "Commande récupérée par le coursier"
    } else if (status === 'receive') {
      return "Commande récupérée par le client"
    } else if (status === 'left_for_customer_service') {
      return "Un coursier a laissé la commande au service client"
    } else if (status === 'return') {
      return "Commande renvoyée dans le locker par le client"
    }
  }





  



  /// renvoi une chaine de caractère aléatoire
  export function _strRandom(o: any) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
      if (o.includeNumbers) {
        e += '1234567890';
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
  }




 /********************************
   * filtre image en fonction de la zone de température
   *******************************/
 export const _imgFilter = (data: any) => {
  const imge =
    // data === 'LT'
    data === 'FRESH'
      ? 'organic-food'
      // : data === 'FREEZE'
      // ? 'winter'
      : data === 'NORMAL'
      ? 'dry'
      : 'nada'
  return imge
}
 /********************************
   * filtre image en fonction de la zone de température
   *******************************/
 export const _imgFilter2 = (data: any) => {
  const imge =
    data === 'MT'
    // data === 'FRESH'
      ? 'organic-food'
      : data === 'LT'
      ? 'winter'
      : data === 'HT'
      ? 'dry'
      : 'nada'
  return imge
}
 
/********************************
   * filtre icon en fonction de la zone de température (keyTemp)
   *******************************/
 export const _iconFilter = (data: any) => {
  const imge =
    data === 'FRESH'
      ? fresh
      : data === 'FREEZE'
      ? freeze
      : data === 'NORMAL'
      ? normal
      : 'nada'
  return imge
}
 export const _iconFilter2 = (data: any) => {
  const imge =
    data === 'LT'
      ? fresh
      : data === 'LT'
      ? freeze
      : data === 'MT'
      ? normal
      : 'nada'
  return imge
}
 export const _iconFilter3 = (data: any) => {
  const imge =
    data === 'Froid positif'
      ? fresh
      : data === 'Froid négatif'
      ? freeze
      : data === 'Ambiant'
      ? normal
      : 'nada'
  return imge
}

/********************************
   * filtre nom de la zone en fonction du keyTemp
   *******************************/
 export const _tempFilter = (data: any) => {
  const imge =
    data === 'FRESH'
      ? 'fraîche'
      : data === 'FREEZE'
      ? 'congelée'
      : data === 'NORMAL'
      ? 'Ambiante'
      : 'nada'
  return imge
}


/////////////////////////////////
// Rafraîcit l'application
/////////////////////////////////

export const _refreshPage = () => {
  window.location.reload()
}




/////////////////////////////////
// tri les commandes en fonction de leur status
/////////////////////////////////

export const _getOrdersByStatus = (token: any, status: any, setData: any) => {
    
  OrdersService.ordersByStatus(token, status)
  .then((response: any) => {
    
   setData(response.data)
      console.log(response.data["hydra:member"])
    })
    .catch((error: any) => {
      console.log(error)

      
    })
}


/////////////////////////////////
// Localisation courte
/////////////////////////////////

export const _shortLocation = (location: any) => {
const short =   location === '/api/lockers/1' ? 'Côté mer' : location === '/api/lockers/2' ? 'Côté mont.' : location === '/api/lockers/4' ? "Faa'a" : 'Arue'

return short
}