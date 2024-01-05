import React, { useState, useEffect } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Input, Container, Row, Form, Label, Col } from "reactstrap";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from './AuthContext'; // Import useAuth hook

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const {isLoggedIn } = useAuth(); // Assuming there's an 'isLoggedIn' property in your auth context

  useEffect(() => {
    // If the user is already logged in, redirect to the dashboard
    if (isLoggedIn) {
      router.push("/page/account/dashboard");
      toast.error('You are logged In, Logout for new Registration')
    }
  }, [isLoggedIn, router]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      // Passwords don't match, handle this case
      console.error("Passwords do not match");
      toast.error("Passwords do not match");
      // Display an error message or handle UI accordingly
      return;
    }

    try {
      const response = await fetch(
        "https://backend.tonserve.com:8000/api/user/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN":
              "6AmBjCELe3D11wq4Iehdog7FsBQbi5z7nucJnZI1WENuv25T3gcNu1rl0o4mMwS5", // Your CSRF token
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // Registration successful, redirect to login page
        router.push("/page/account/login"); // Replace '/login' with your actual login route
      } else {
        // Handle registration errors
        if (responseData.email && responseData.email.length > 0) {
          // Handle email error
          console.log("Email Error:", responseData.email[0]);
          // Display email error message or handle UI accordingly
          toast.error(responseData.email[0]);
        }
        if (responseData.password1 && responseData.password1.length > 0) {
          // Handle password1 error
          console.log("Password Error:", responseData.password1[0]);
          // Display password1 error message or handle UI accordingly
          toast.error(responseData.password1[0]);
        }
        if (responseData.phone_number && responseData.phone_number.length > 0) {
          // Handle phone_number error
          console.log("Phone Number Error:", responseData.phone_number[0]);
          // Display phone_number error message or handle UI accordingly
          toast.error(responseData.phone_number[0]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Error:", error);
      // Handle server errors or connection issues
      toast.error(
        "Unable to Create an Account now, Please try after sometime!"
      );
    }
  };

  return (
    <CommonLayout parent="home" title="register">
      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="12">
              <h3>Create Account</h3>
              <div className="theme-card">
                <Form className="theme-form" onSubmit={handleRegister}>
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="first_name">
                        First Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="first_name"
                        placeholder="First Name"
                        required=""
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="last_name">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="last_name"
                        placeholder="Last Name"
                        required=""
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        required=""
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="phone_number">
                        Phone Number
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="phone_number"
                        placeholder="Phone Number"
                        required=""
                        value={formData.phone_number}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="review">
                        Password
                      </Label>
                      <Input
                        type="password"
                        className="form-control"
                        id="password1"
                        placeholder="Enter your password"
                        required=""
                        value={formData.password1}
                        onChange={(e) =>
                          setFormData({ ...formData, password1: e.target.value })
                        }
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="review">
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        className="form-control"
                        id="password2"
                        placeholder="Confirm your password"
                        required=""
                        value={formData.password2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password2: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col md="12">
                      <button type="submit" className="btn btn-solid w-auto">
                        Create Account
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Register;
