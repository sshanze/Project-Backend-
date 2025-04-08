// validationMiddleware.js
import { body, validationResult } from 'express-validator';

export const validateComplaint = [
  body('category').isMongoId(),
  body('subcategory').notEmpty(),
  body('description').isLength({ min: 10 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];