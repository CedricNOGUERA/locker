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


  export const _searchWithRegex = (searchOrder: any, orderTab: any, setOrderFilter: any ) => {
    function escapeRegExp(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    const escapedSearchOrder = escapeRegExp(searchOrder);
  
    setOrderFilter(orderTab.filter((order: any) => {
      if (escapedSearchOrder.length > 2) {
        return order?.orderNum?.match(new RegExp(escapedSearchOrder, "i"));
      }
        return undefined;
      

    }))
  }


   /********************************
   * Change order status
   *******************************/

  export const _updateStatus = (id: any, orderData: any, setOrderData: any, messageApi: any, setSelectedOrder: any, objectif: any ) => {
    const indx = orderData?.findIndex((order: any) => order.id === id);
    const filteredOrder = orderData?.filter((order: any) => order.id === id);

    const newTab = [...orderData];
    const newStatus = {
      id: filteredOrder[0].id,
      location: filteredOrder[0].location,
      orderNum: filteredOrder[0].orderNum,
      temp: filteredOrder[0].temp,
      numbContainer: filteredOrder[0].numbContainer,
      firstNameCustom: filteredOrder[0].firstNameCustom,
      LastNameCustom: filteredOrder[0].LastNameCustom,
      detailOrder: filteredOrder[0].detailOrder,
      status: objectif,
    };
    newTab[indx] = newStatus;

    setOrderData(newTab);

    _successNotif(filteredOrder[0].id, messageApi, setSelectedOrder);

    if (filteredOrder.length > 0) {
      _successNotif(filteredOrder[0].id, messageApi, setSelectedOrder);
    } else {
      _errorNotif(filteredOrder[0].id, messageApi, setSelectedOrder);
    }
  };



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




  

