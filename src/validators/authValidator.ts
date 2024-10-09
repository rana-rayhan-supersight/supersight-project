import { body, ValidationChain } from "express-validator";

// Validation for user registration
const validateUserRegistration: ValidationChain[] = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters long"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters long"),

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
    .isLength({ min: 8, max: 128 })
    .withMessage("Password length must be between 8 and 128 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,128}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character."
    ),
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

// Validation for user login
const validateUserVerify: ValidationChain[] = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits long")
    .matches(/^[0-9]{6}$/)
    .withMessage("Verification code must be numeric"),
];

// Validation for user login
const validateUpdatePassword: ValidationChain[] = [
  // Validate current password
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current Password is required")
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 characters long"),
  // Validate new password
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,128}$/
    )
    .withMessage(
      "New password must include uppercase, lowercase, number, and special character."
    ),
];

const validateUpdateUser: ValidationChain[] = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters long"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters long"),
];

export {
  validateUserRegistration,
  validateUserLogin,
  validateUserVerify,
  validateUpdatePassword,
  validateUpdateUser,
};
