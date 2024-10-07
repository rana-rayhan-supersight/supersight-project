import { body, ValidationChain } from "express-validator";

// Validation for user registration
const validateUserRegistration: ValidationChain[] = [
  //   body("name")
  //     .trim()
  //     .notEmpty()
  //     .withMessage("Name is required")
  //     .isLength({ min: 3, max: 31 })
  //     .withMessage("Name length must be 3-31 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,128}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character."
    ),
  //   body("phone")
  //     .trim()
  //     .notEmpty()
  //     .withMessage("Phone is required")
  //     .isLength({ min: 6 })
  //     .withMessage("Phone length must be min 6 characters long"),
  //   body("address")
  //     .trim()
  //     .notEmpty()
  //     .withMessage("Address is required")
  //     .isLength({ min: 3 })
  //     .withMessage("Address length must be min 3 characters long"),
  //   body("image").optional().isString().withMessage("User Image is optional"),
];

// Validation for user login
const validateUserLogin: ValidationChain[] = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,128}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character."
    ),
];

export { validateUserRegistration, validateUserLogin };
