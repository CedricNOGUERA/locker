
import { Card, Form, Button, Container, Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import {users} from '../data/users'
import userDataStore from "../store/userDataStore";
import { useEffect, useState } from "react";
import Loading from "./ui/Loading";
import "../App.css";
import AuthService from "../service/Auth/AuthService";
import UserService from "../service/UserService";

type Inputs = {
    userName: string,
    pass: string,
  };

const Auth = () => {

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Inputs>();
    
    const authLogin = userDataStore((state: any) => state.authLogin)
    const isLogged = userDataStore((state: any) => state.isLogged)
    const dataStore = userDataStore((state: any) => state)
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [token, setToken] = useState<any>([])
    const [formData, setFormData] = useState<any>([])
    // const [isLogged, setIsLogged] = useState<boolean>(false)
  const [myData, setMyData] = useState<any>([]);


  


    useEffect(() => {
      getMyData(token)
 
    }, [token])


    useEffect(() => {
    
         if (token && token.length > 0) {
           authLogin(true, myData.id, myData.firstName, myData?.memberOf ? myData?.memberOf[0]?.id : null, myData?.memberOf ? myData?.memberOf[0]?.name : null, token)
         }

    }, [myData])

    

    const signUp: SubmitHandler<Inputs> = (dataz: any, e: any) => {
      e.preventDefault()

      AuthService.login(dataz.userName, dataz.pass, setToken)
        setIsLoading(false)
        setFormData(dataz)
        
      }
      
      
      const getMyData = (token: any) => {
        UserService.me(token)
        .then((response: any) => {
          setMyData(response.data)
        })
      }


 console.log(myData.firstName)
  return (
    <Container className="col-11 col-lg-4 mt-5">
        {isLogged && (
            <Navigate to="/in-progress" />
            // <p>Welcome</p>
        )}
      {isLoading ? (
       <Loading variant="info" />
      ) : (
        <Card className="">
          <Card.Body>
            <div className="text-center animate__animated animate__fadeIn">
            
              <img alt="Kangaroo icon" src="https://img.icons8.com/external-others-inmotus-design/64/external-Kangaroo-animal-faces-others-inmotus-design-2.png"/>
            </div>
            <div className="text-center">
              <h4>Lockery</h4>
            </div>
            <Form onSubmit={handleSubmit(signUp)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer votre username"
                  {...register("userName", { required: true })}
                />
                {errors.userName && (
                 <Alert variant="danger" className="mt-2 py-0 w-75">
                    Ce champ est obligatoire
                  </Alert>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrer votre password"
                  {...register("pass", { required: true })}
                />
                {errors.pass && (
                  <Alert variant="danger" className="mt-2 py-0 w-75">
                 <small> Ce champ est obligatoire </small>
                  </Alert>
                )}
              </Form.Group>
              {isError && (
                <Form.Text className="text-danger">
                  <small>
                    Une erreur s'est glissée dans vos données, merci de
                    réessayer
                  </small>
                </Form.Text>
              )}
              <Button variant="info" type="submit" className="w-100 mt-4 text-light">
                Valider
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Auth;
