export const _notif = (id: any, messageApi: any, setSelectedOrder: any) => {
    messageApi.open({
      type: 'success',
      content: `Commande # ${id} déposée`,
      duration: 2.2,
    });
    setSelectedOrder("")
  };



  export const searchWithRegex = (searchOrder: any, orderTab: any, setOrderFilter: any ) => {
    function escapeRegExp(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    const escapedSearchOrder = escapeRegExp(searchOrder);
  
    setOrderFilter(orderTab.filter((order: any) => {
      if (escapedSearchOrder.length > 2) {
        return order?.orderNum?.match(new RegExp(escapedSearchOrder, "i"));
      }
    }))
  }