import React, { useContext, useState } from "react";
import { Media, Container, Form, Row, Col } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import paypal from "../../../../public/assets/images/paypal.png";
import { PayPalButton } from "react-paypal-button-v2";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const StripePay = ({ onSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (elements == null || stripe == null) {
      return;
    }

    try {
      // Trigger form validation and payment element collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        // Show error to your customer
        setErrorMessage(submitError.message);
        return;
      }

      // Use the Stripe client to confirm the payment
      const { paymentIntent, error } = await stripe.confirmCardPayment('{pk_test_I8XFeUwEEFSEVuNZm11k8btS}', {
        payment_method: {
          card: elements.getElement(CardElement), // Assuming you're using CardElement for card input
          billing_details: { /* billing details */ },
        },
      });

      if (error) {
        // Payment failed to process
        setErrorMessage(error.message);
        return;
      }

      // Payment succeeded, call the onSubmit function passed from the parent component
      onSubmit();
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('Error processing payment. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button style={{ marginTop: '20px' }} className="btn-solid btn" type="submit" disabled={!stripe || !elements}>
        Pay with Stripe
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};


const stripePromise = loadStripe('pk_test_I8XFeUwEEFSEVuNZm11k8btS');

const options = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};








const CheckoutPage = () => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const [obj, setObj] = useState({});
  const [payment, setPayment] = useState("cod");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // initialise the hook
  const router = useRouter();
  


  
  






  const checkhandle = (value) => {
    setPayment(value);
  };

  const createOrder = async (orderData) => {
    try {
      // Make a POST request to the WooCommerce API to create the order
      const response = await fetch("https://tonserve.com/hfh/wp-json/wc/v3/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your WooCommerce API credentials here (consumer key and secret)
          Authorization: "Basic " + btoa("ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2:cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea"),
        },
        body: JSON.stringify(orderData),
      });
  
      // Check if the request was successful
      if (response.ok) {
        const responseData = await response.json();
        return responseData.id; // Return the ID of the created order
      } else {
        // Handle errors if the request was not successful
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }
    } catch (error) {
      // Handle any other errors that may occur during the process
      throw new Error("Failed to create order: " + error.message);
    }
  };




  const onSubmit = async (formData) => {
    // Extract form data
    const { billingDetails, shippingDetails, cartItems } = formData;
  
    // Prepare order data
    const orderData = {
      billing: billingDetails,
      shipping: shippingDetails,
      line_items: cartItems.map((item) => ({
        product_id: item.id, // Assuming the product ID is stored in 'id'
        quantity: item.quantity, // Assuming the quantity is stored in 'quantity'
      })),
      // Add any additional order data as needed
    };
  
    try {
      const orderId = await createOrder(orderData);
      // Redirect to the thank you page with the order ID
      window.location.href = `/thank-you?order_id=${orderId}`;
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage("Error creating order. Please try again later.");
    }
  };

  const setStateFromInput = (event) => {
    obj[event.target.name] = event.target.value;
    setObj(obj);
  };


  
  return (
    <section className="section-b-space">
      <Container>
        <div className="checkout-page">
          <div className="checkout-form">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg="6" sm="12" xs="12">
                  <div className="checkout-title">
                    <h3>Billing Details</h3>
                  </div>
                  <div className="row check-out">
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">First Name</div>
                      <input
                        type="text"
                        className={`${errors.firstName ? "error_border" : ""}`}
                        name="first_name"
                        {...register("first_name", { required: true })}
                      />
                      <span className="error-message">
                        {errors.firstName && "First name is required"}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Last Name</div>
                      <input
                        type="text"
                        className={`${errors.last_name ? "error_border" : ""}`}
                        name="last_name"
                        {...register("last_name", { required: true })}
                      />
                      <span className="error-message">
                        {errors.last_name && "Last name is required"}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Phone</div>
                      <input
                        type="text"
                        name="phone"
                        className={`${errors.phone ? "error_border" : ""}`}
                        {...register("phone", { pattern: /\d+/ })}
                      />
                      <span className="error-message">
                        {errors.phone && "Please enter number for phone."}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Email Address</div>
                      <input
                        //className="form-control"
                        className={`${errors.email ? "error_border" : ""}`}
                        type="text"
                        name="email"
                        {...register("email", {
                          required: true,
                          pattern: /^\S+@\S+$/i,
                        })}
                      />
                      <span className="error-message">
                        {errors.email && "Please enter proper email address ."}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Country</div>
                      <select
                        name="country"
                        {...register("country", { required: true })}
                      >
                        <option>India</option>
                        <option>South Africa</option>
                        <option>United State</option>
                        <option>Australia</option>
                      </select>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Address</div>
                      <input
                        //className="form-control"
                        className={`${errors.address ? "error_border" : ""}`}
                        type="text"
                        name="address"
                        {...register("address", {
                          required: true,
                          min: 20,
                          max: 120,
                        })}
                        placeholder="Street address"
                      />
                      <span className="error-message">
                        {errors.address && "Please right your address ."}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Town/City</div>
                      <input
                        //className="form-control"
                        type="text"
                        className={`${errors.city ? "error_border" : ""}`}
                        name="city"
                        {...register("city", { required: true })}
                        onChange={setStateFromInput}
                      />
                      <span className="error-message">
                        {errors.city && "select one city"}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">State / County</div>
                      <input
                        //className="form-control"
                        type="text"
                        className={`${errors.state ? "error_border" : ""}`}
                        name="state"
                        {...register("state", { required: true })}
                        onChange={setStateFromInput}
                      />
                      <span className="error-message">
                        {errors.state && "select one state"}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">Postal Code</div>
                      <input
                        //className="form-control"
                        type="text"
                        name="pincode"
                        className={`${errors.pincode ? "error_border" : ""}`}
                        {...register("pincode", { pattern: /\d+/ })}
                      />
                      <span className="error-message">
                        {errors.pincode && "Required integer"}
                      </span>
                    </div>
                    <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <input
                        type="checkbox"
                        name="create_account"
                        id="account-option"
                      />
                      &ensp;{" "}
                      <label htmlFor="account-option">Create An Account?</label>
                    </div>
                  </div>
                </Col>
                <Col lg="6" sm="12" xs="12">
                  {cartItems && cartItems.length > 0 > 0 ? (
                    <div className="checkout-details">
                      <div className="order-box">
                        <div className="title-box">
                          <div>
                            Product <span>Total</span>
                          </div>
                        </div>
                        <ul className="qty">
                          {cartItems.map((item, index) => (
                            <li key={index}>
                              <div className="checkoutProductList">
                                {/* Displaying size and quantity from selectedSizesQuantities */}

                                <p>
                                <b>
                                  {item.name} × 
                                 
                                    {
                                    item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ?
                                      item.sizesQuantities.reduce((totalQty, sizeQuantity) => totalQty + sizeQuantity.quantity, 0) :
                                      0
                                    }
                                  </b>{" "}
                                </p>
                                <p>Color : {item.color}</p>
                                <p>Size / Quantity: </p>
                                {item.sizesQuantities &&
                                Array.isArray(item.sizesQuantities) &&
                                item.sizesQuantities.length > 0 ? (
                                  item.sizesQuantities.map(
                                    (sizeQuantity, index) => (
                                      <div key={index}>
                                        <p style={{ margin: "3px 0px" }}>
                                          {sizeQuantity.size} /{" "}
                                          {sizeQuantity.quantity} 
                                          {/* (
                                          {sizeQuantity.item_number}){" "} */}
                                        </p>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p>
                                    No size or quantity information available.
                                  </p>
                                )}
                              </div>
                              <div className="checkoutTotalList">
                                <span>
                                  {symbol}
                                  {item.totalPrice}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <ul className="sub-total">
                          <li>
                            Subtotal{" "}
                            <span className="count">
                              {symbol}
                              {cartTotal.toFixed(2)}
                            </span>
                          </li>
                          <li>
                            Shipping
                            <div className="shipping">
                              <div className="shopping-option">
                                <input
                                  type="checkbox"
                                  name="free-shipping"
                                  id="free-shipping"
                                />
                                <label htmlFor="free-shipping">
                                  Free Shipping
                                </label>
                              </div>
                              <div className="shopping-option">
                                <input
                                  type="checkbox"
                                  name="local-pickup"
                                  id="local-pickup"
                                />
                                <label htmlFor="local-pickup">
                                  Local Pickup
                                </label>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <ul className="total">
                          <li>
                            Total{" "}
                            <span className="count">
                              {symbol}
                              {cartTotal.toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="payment-box">
                        
                        {cartTotal !== 0 ? (
                          <div className="text-end">
                           
                              <Elements stripe={stripePromise} options={options}>
                              <StripePay onSubmit={onSubmit} />
                              </Elements>
                          
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CheckoutPage;
