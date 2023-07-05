export const getError = (error: any) => {
    // if (isNetworkError(error)) {
    //   return handleNetworkError(error);
    // }
    // if (isBadRequestError(error)) {
    //   return handleBadRequestError(error);
    // }
    if (isUnauthorizedError(error)) {
      return handleUnauthorizedError(error);
    }
    if (isForbiddenError(error)) {
      return handleForbiddenError(error);
    }
    if (isNotFoundError(error)) {
      return handleNotFoundError(error);
    }
    if (isUnprocessableContent(error)) {
      return handleUnprocessableContent(error);
    }
    if (isInternalError(error)) {
      return handleInternalError(error);
    }
    if (isServiceUnavailableError(error)) {
      return handleServiceUnavailableError(error);
    }
    if (isGatewayTimeoutError(error)) {
      return handleGatewayTimeoutError(error);
    }
  };
  

  // Unauthorized errors (401)
  const isUnauthorizedError = (error: any) => {
    return error.code === "ERR_UNAUTHORIZED";
  };
  
  const handleUnauthorizedError = (error: any) => {
    return "Incorrect email or password, try again";
  };
  
  // Forbidden errors (403)
  const isForbiddenError = (error: any) => {
    return error.code === "ERR_FORBIDDEN";
  };
  
  const handleForbiddenError = (error: any) => {
    return "Vous n'êtez pas autorisé, action bloquée";
  };
  
  // Not Found errors (404)
  const isNotFoundError = (error: any) => {
    return error.code === "ERR_NOT_FOUND";
  };
  
  const handleNotFoundError = (error: any) => {
    return "Ressource non trouvée";
  };
  
  // Not Found errors (422)
  const isUnprocessableContent = (error: any) => {
    return ((error?.response?.status === 422 || error?.response?.status === "ERR_BAD_REQUEST") && (error?.response?.statusText === "Unprocessable Content" || error?.message === "Request failed with status code 422"));
  };
  
  const handleUnprocessableContent = (error: any) => {
    return "Contenu non traitable";
  };
  
  // Internal Server errors (500)
  const isInternalError = (error: any) => {
    return (
      (error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_RESPONSE') &&
      (error.message === 'Request failed with status code 500' ||
        error.message === 'Network Error')
    )
  };
  
  const handleInternalError = (error: any) => {
    return "Erreur interne du serveur. Réessayez"
  };
  
  // Service Unavailable errors (503)
  const isServiceUnavailableError = (error: any) => {
    return error.code === "ERR_SERVICE_UNAVAILABLE";
  };
  
  const handleServiceUnavailableError = (error: any) => {
    return "Service temporairement indisponible";
  };
  
  // Gateway Timeout errors (504)
  const isGatewayTimeoutError = (error: any) => {
    return error.code === "ERR_GATEWAY_TIMEOUT";
  };
  
  const handleGatewayTimeoutError = (error: any) => {
    return "Temps d'attente du serveur écoulé";
  };
  // add more error types and corresponding handlers as needed