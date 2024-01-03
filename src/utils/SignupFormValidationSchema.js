import * as yup from "yup";
import { messages } from "./messages";
import { regExpression } from "./regEx";

export const signupValidationSchema = yup.object().shape({
  name: yup.string().required("please add your name"),

  email: yup
    .string()
    .email(messages.emailRequired)
    .required(messages.emailRequired)
    .matches(
      regExpression.emailRegex.mailFormat,
      messages.emailStandard.mailFormat
    ),
  // .matches(regExpression.emailRegex.twoAt, messages.emailStandard.twoAt),
  // countryCode: yup.object().shape({
  //   value: yup.string().required(messages.countryCode)
  // }),

  password: yup
    .string()
    .required(messages.passwordRequired)
    .min(8, messages.shortPassword)
    .max(15, messages.longPassword)
    .matches(
      regExpression.passwordRegex.lowercase,
      messages.passwordStandard.lowercase
    )
    .matches(
      regExpression.passwordRegex.uppercase,
      messages.passwordStandard.uppercase
    )
    .matches(
      regExpression.passwordRegex.specialChar,
      messages.passwordStandard.specialChar
    )
    .matches(
      regExpression.passwordRegex.number,
      messages.passwordStandard.number
    ),

  confirmPassword: yup
    .string()
    .required(messages.requiredConfirmPassword)
    .oneOf([yup.ref("password"), null], messages.confirmPassword),
});
