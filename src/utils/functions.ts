export const _notif = (id: any, messageApi: any, setSelectedOrder: any) => {
    messageApi.open({
      type: 'success',
      content: `Commande # ${id} déposée`,
      duration: 1.2,
    });
    setSelectedOrder("")
  };