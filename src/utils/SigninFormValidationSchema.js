import * as yup from "yup";
import { messages } from "./messages";
import { regExpression } from "./regEx";

export const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(messages.emailRequired)
    .required(messages.emailRequired)
    .matches(
      regExpression.emailRegex.mailFormat,
      messages.emailStandard.mailFormat
    ),
  password: yup
    .string()
    .required(messages.passwordRequired)
    .min(6, messages.shortPassword)
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
});
