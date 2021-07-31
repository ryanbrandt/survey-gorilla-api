import { NextFunction, Request, Response } from "express";

import { NotFoundError, ValidationError } from "objection";
import { STATUS } from "../utils/types";

const errorMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  let status = STATUS.SERVER_ERROR;
  let message = "Internal server error";

  if (error instanceof NotFoundError) {
    status = STATUS.NOT_FOUND;
    message = "Resource not found";
  } else if (error instanceof ValidationError) {
    status = STATUS.CLIENT_ERROR;
    message = error.message;
  }

  response.status(status).send(message);

  next();
};

export default errorMiddleware;
