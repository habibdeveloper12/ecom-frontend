import React, { useContext, useEffect, useRef, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./card.css";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "react-stripe-checkout";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import axiosInstance from "../config/axiosConfig";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutValidationSchema } from "../utils/CheckoutValidation";
import { toast } from "react-toastify";
import { AuthContext } from "../components/AuthContext";
import { useHistory } from "react-router-dom";
const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);
const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const [perUser, setPerUser] = useState({});
  const { user } = useContext(AuthContext);
  // useEffect(() => {
  //   const handleFindUser = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/users/user/${user?.userId}`);
  //       console.log(response.data);
  //       setPerUser(response.data);
  //     } catch (error) {
  //       console.error("Error finding user:", error);
  //       setPerUser(null);
  //     }
  //   };
  //   handleFindUser();
  // }, [perUser]);
  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    const {
      handleSubmit,
      register,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(checkoutValidationSchema),
      mode: "onBlur",
      defaultValues: {
        firstName: perUser?.name,
        email: perUser?.email,
      },
    });
    const [card, setCard] = useState(false);
    let subtotal = 0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });
    console.log(state);
    state.map((item) => {
      return (totalItems += item.qty);
    });
    console.log(user);

    const stripe = useStripe();
    const elements = useElements();
    const history = useNavigate();

    const handlePayment = async (data) => {
      try {
        const billingDetails = {
          name: data.firstName + " " + data.lastName,
          email: data.email,
          address: {
            line1: data.address,
            line2: data.address2,
            city: "",
            state: data.state,
            postal_code: data.zip,
            country: "BD",
          },
        };

        const response = await axiosInstance.post("/users/payment-intent", {
          amount: Math.round(subtotal) * 1000,
          billing_details: billingDetails,
        });

        if (response.status === 200) {
          const clientSecret = response.data.client_secret;

          const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: billingDetails,
          });

          if (error) {
            console.error(error);
            toast.error("Payment failed. Please check your card details.");
          } else {
            const { paymentIntent, error } = await stripe.confirmCardPayment(
              clientSecret,
              {
                payment_method: paymentMethod.id,
              }
            );

            if (error) {
              console.error(error);
              toast.error("Payment failed. Please try again.");
            } else if (paymentIntent.status === "succeeded") {
              await storeOrderDetails(data);
              toast.success("Payment successful! Order placed.");

              history("/dashboard");
            }
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred during payment. Please try again.");
      }
    };

    const storeOrderDetails = async (data) => {
      try {
        // Make an API request to store order details on your server
        const response = await axiosInstance.post("/store-order", {
          user: {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            address: {
              line1: data.address,
              line2: data.address2,
              city: "",
              state: data.state,
              postal_code: data.zip,
              country: data.country,
            },
          },
          products: state,
          status: "success",
        });

        if (response.status !== 200) {
          throw new Error("Failed to store order details.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to store order details. Please contact support.");
      }
    };

    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})
                      <span>${Math.round(subtotal)}</span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form
                    className="needs-validation"
                    onSubmit={handleSubmit(handlePayment)}
                  >
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.firstName ? "is-invalid" : ""
                          }`}
                          id="firstName"
                          placeholder=""
                          {...register("firstName")}
                        />
                        <div className="invalid-feedback">
                          {errors.firstName?.message}
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.lastName ? "is-invalid" : ""
                          }`}
                          id="lastName"
                          placeholder=""
                          {...register("lastName")}
                        />
                        <div className="invalid-feedback">
                          {errors.lastName?.message}
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          defaultValue={perUser?.email}
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          id="email"
                          placeholder="you@example.com"
                          {...register("email")}
                        />
                        <div className="invalid-feedback">
                          {errors.email?.message}
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          id="address"
                          placeholder="1234 Main St"
                          {...register("address")}
                        />
                        <div className="invalid-feedback">
                          {errors.address?.message}
                        </div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="address2" className="form-label">
                          Address 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          placeholder="Apartment or suite"
                          {...register("address2")}
                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <br />
                        <select
                          className={`form-select ${
                            errors.country ? "is-invalid" : ""
                          }`}
                          id="country"
                          {...register("country")}
                        >
                          <option value="">Choose...</option>
                          <option>Bangladesh</option>
                        </select>
                        <div className="invalid-feedback">
                          {errors.country?.message}
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <br />
                        <select
                          className={`form-select ${
                            errors.state ? "is-invalid" : ""
                          }`}
                          id="state"
                          {...register("state")}
                        >
                          <option value="">Choose...</option>
                          <option>Dhaka</option>
                        </select>
                        <div className="invalid-feedback">
                          {errors.state?.message}
                        </div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label htmlFor="zip" className="form-label">
                          Zip
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.zip ? "is-invalid" : ""
                          }`}
                          id="zip"
                          placeholder=""
                          {...register("zip")}
                        />
                        <div className="invalid-feedback">
                          {errors.zip?.message}
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Payment with Stripe</h4>
                    <img src="stripe.png" />

                    <div className="px-5 py-5 bg-light">
                      <CardElement id="card" />
                    </div>

                    <button className="btn btn-primary my-4" type="submit">
                      Complete Payment
                    </button>
                  </form>

                  <hr className="my-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? (
          <Elements stripe={stripePromise}>
            <ShowCheckout />
          </Elements>
        ) : (
          <EmptyCart />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
