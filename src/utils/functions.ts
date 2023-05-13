import axios from "axios";
import OrdersService from "../service/Orders/OrdersService";

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
      if (escapedSearchOrder.length > 2) {
        return order?.barcode?.match(new RegExp(escapedSearchOrder, "i"));
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
    const newStatuss = {
      id: filteredOrder[0].id,
   
      
      status:  newStatus,
      
    };
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

console.log("object")


    })


  }


  export const _getStatus = (status: any) => {
    if (status === 'created') {
      return "Prêt"
    } else if (status === 'operin') {
      return "Déposé"
    } else if (status === 'reminder') {
      return "1er Rappel"
    } else if (status === 'overtimedue') {
      return "2è Rappel"
    } else if (status === 'overtime') {
      return "Expiré"
    } else if (status === 'operout') {
      return "Colis récupéré par le coursier"
    } else if (status === 'receive') {
      return "Reçu"
    } else if (status === 'left_for_customer_service') {
      return "Service client"
    } else if (status === 'return') {
      return "Retour"
    }
  }






  export const _getStatusMsg = (status: any) => {
    if (status === 'created') {
      return "Colis préparé et prêt à l'envoi"
    } else if (status === 'operin') {
      return "Colis déposé par le coursier"
    } else if (status === 'reminder') {
      return "Evènement automatique - Rappel d'un colis non récupéré depuis un certain temps"
    } else if (status === 'overtimedue') {
      return "Evènement automatique - Colis non récupéré et proche de l'expiration"
    } else if (status === 'overtime') {
      return "Evènement automatique - Colis non récupéré et expiré"
    } else if (status === 'operout') {
      return "Colis récupéré par le coursier"
    } else if (status === 'receive') {
      return "Colis récupéré par le client"
    } else if (status === 'left_for_customer_service') {
      return "Un coursier a laissé la commande au service client"
    } else if (status === 'return') {
      return "Colis renvoyé dans le locker par le client"
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




  

