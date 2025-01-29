import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

/**
 * Middleware to validate request using express-validator rules
 * @param validations Array of validation chains
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};
