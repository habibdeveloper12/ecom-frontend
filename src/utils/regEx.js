export const regExpression = {
  passwordRegex: {
    uppercase: /[A-Z]+/,
    lowercase: /[a-z]+/,
    number: /\d+/,
    specialChar: /[@$!%*#?&]+/,
  },

  emailRegex: {
    mailFormat: /[a-zA-Z]{2,4}$/,
    // mailFormat:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/,
    twoAt: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  nameRegex: /^[a-z ,.'-]+$/i,
};
