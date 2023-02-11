
import { Card, Form, Button, Container, Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import {users} from '../data/users'
import userDataStore from "../store/userDataStore";
import { useEffect, useState } from "react";
import Loading from "./ui/Loading";
import "../App.css";

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
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)


    useEffect(() => {
        if(users){
            setIsLoading(false)
        }
    }, [])
    
    
    const signUp: SubmitHandler<Inputs> = (data: any, e: any) => {
        e.preventDefault()
        const authUser = users?.filter((user: any) => user.username === data.userName && user.password === data.pass)

        if(authUser && authUser.length > 0){
            authLogin(true, authUser[0]?.id, authUser[0]?.username, authUser[0].company_id)           
        }
        else{
            setIsError(true)
        }
    };
 

  return (
    <Container className="col-11 col-lg-4 mt-5">
        {isLogged && (
            <Navigate to="/" />
        )}
      {isLoading ? (
       <Loading variant="info" />
      ) : (
        <Card className="">
          <Card.Body>
            <div className="text-center">
              <img
                alt="avatar"
                src="https://img.icons8.com/stickers/64/school-locker.png"
              />
            </div>
            <div className="text-center">
              <h4>Lockery</h4>
            </div>
            <Form onSubmit={handleSubmit(signUp)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer votre nom"
                  {...register("userName", { required: true })}
                />
                {errors.userName && (
                  <Alert variant="warning" className="mt-2 py-1">
                    This field is required
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
                  <Alert variant="warning" className="mt-2 py-1">
                    This field is required
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

              <Button variant="primary" type="submit" className="w-100 mt-4">
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
