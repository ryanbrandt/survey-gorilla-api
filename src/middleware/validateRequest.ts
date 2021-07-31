import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "objection";

const validateRequest = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    next(
      new ValidationError({
        type: "Request Validation",
        message: "Invalid request",
      })
    );
  }

  next();
};

export default validateRequest;
