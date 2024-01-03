import * as yup from "yup";
import { messages } from "./messages";
import { regExpression } from "./regEx";

export const checkoutValidationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Zip code is required"),
});
