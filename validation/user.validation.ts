import { body, sanitizeBody, check } from "express-validator";
import db from "../config/db";

const registerValidation = [
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return db
        .select("*")
        .from("users")
        .where("email", value)
        .first()
        .then((user: any) => {
          if (user) {
            return Promise.reject("Email is already in use");
          }
        });
    }),
  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater."),
  // Sanitize fields.
  sanitizeBody("first_name").escape(),
  sanitizeBody("last_name").escape(),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  //   check("first_name", "First name is required").not().isEmpty(),
  //   check("last_name", "Last name is required").not().isEmpty(),
  //   check("email", "Please enter a valid email")
  //     .isEmpty()
  //     .normalizeEmail({ gmail_remove_dots: true })
  //     .custom((value) => {
  //       return db
  //         .select("*")
  //         .from("users")
  //         .where("email", value)
  //         .first()
  //         .then((user: any) => {
  //           if (user) {
  //             return Promise.reject("Email is already in use");
  //           }
  //         });
  //     }),
  //   check("password", "Password must be 6 or more characters").isLength({
  //     min: 6,
  //   }),
];

const loginValidation = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
];

export { registerValidation, loginValidation };
