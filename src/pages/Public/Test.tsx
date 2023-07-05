import axios from 'axios';
import React from 'react'
import { Container, Table } from 'react-bootstrap';

const Test = () => {

    const [order, setOrder] = React.useState<any>([]);
    const [dataOrder, setDataOrder] = React.useState<any>([]);




    React.useEffect(() => {
        
    getAllOrder()
    getPrestaOrder()
        
    }, []);


    
    const getAllOrder = () => {
      let data = new FormData()

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://prestashop.itahitilab.io/api/order_details/?output_format=JSON&ws_key=GAQVK8PIT3GLV3XBBHNR3EGR9EWJSHUB',
        headers: {
          Cookie:
            'PrestaShop-1b5a073e13c19294c471fb581e4724a2=def50200369329de66cc586fbf4d1b6509dfd7b057371a05af56874fc128bacc226bf303b228ea7c523760580b8695135eded839eacfa9f60fe4c2945b7f88aacad2f34af80c085488e0ed23ed463a92a7d97cbe6af6eb1b58379dbfc8a9b3c235bb0a62e198097ef5eca677eebf2db8839203312b9b1a13fbe10b952985f06669094e4d0068ed8df36dc0605f305fdb625d3a83dca7b5949fb6d318c50e68c5512107',
          // ...data.getHeaders()
        },
        data: data,
      }

      axios
        .request(config)
        .then((response) => {
          setOrder(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }


    const getPrestaOrder = () => {
        let config: any = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://prestashop.itahitilab.io/api/order_details/1?output_format=JSON&ws_key=GAQVK8PIT3GLV3XBBHNR3EGR9EWJSHUB',
            headers: {
              Cookie:
                'PrestaShop-1b5a073e13c19294c471fb581e4724a2=def50200369329de66cc586fbf4d1b6509dfd7b057371a05af56874fc128bacc226bf303b228ea7c523760580b8695135eded839eacfa9f60fe4c2945b7f88aacad2f34af80c085488e0ed23ed463a92a7d97cbe6af6eb1b58379dbfc8a9b3c235bb0a62e198097ef5eca677eebf2db8839203312b9b1a13fbe10b952985f06669094e4d0068ed8df36dc0605f305fdb625d3a83dca7b5949fb6d318c50e68c5512107',
              // ...data.getHeaders()
            },
          }
    
          // axios
          // .request(config)
          // .then((response) => {
          //   setDataOrder(response.data)
          // })
          // .catch((error) => {
          //   console.log(error)
          // })
          let promises = []
    
          for (let i = 0; i < dataOrder?.length; i++) {
            config.data = dataOrder[i]
            promises.push(axios.request(config))
          }
    
          Promise.all(promises)
            .then((responses: any) => {
              setDataOrder(responses)
              console.log(responses)
            })
            .catch((error) => {
             
              console.log(error)
             
            })
    }


console.log(order)
console.log(dataOrder)
  return (
    <Container>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Username</th>
    </tr>
  </thead>
  <tbody>
    {order?.order_details?.map((orders: any) => (
// order_details[0].id
    <tr key={orders.id} >
      <td>{orders?.id}</td>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    ))}

  </tbody>
</Table>

      {/* <div>id de la commande {order?.order_detail?.id}</div>
      <div>{order?.order_detail?.product_name}</div>
      
      <div>{order?.order_detail?.product_price} Xpf</div>
      <div>{order?.order_detail?.product_upc} </div> */}
    </Container>
  )
}

export default Test
