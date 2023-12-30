import React, { useState, useEffect } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { useRouter } from "next/router";
import { useAuth } from './AuthContext'; // Import useAuth hook
import { toast } from "react-toastify";

const Login = () => {
  const { login, isLoggedIn } = useAuth(); // Assuming there's an 'isLoggedIn' property in your auth context
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the user is already logged in, redirect to the dashboard
    if (isLoggedIn) {
      router.push("/page/account/dashboard");
      toast.error('You are already Logged In, Logout first to Login again')
    }
  }, [isLoggedIn, router]);

  const handleCreateAccountRouter = () => {
    router.push("/page/account/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://3.22.79.158:8000/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();

      login(data.access_token, data.user);
console.log(data);

      // Redirect or perform any action upon successful login
      // For example, you can redirect to a different page
      router.push("/page/account/dashboard"); // Replace '/dashboard' with your desired URL

    } catch (error) {
      setError(error.message || "Login failed");
    }
  };

  return (
    <CommonLayout parent="home" title="login">
      <section className="login-page section-b-space">
        <Container>
          <Row>
            <Col lg="6">
              <h3>Login</h3>
              <div className="theme-card">
                <Form className="theme-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <Label className="form-label" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label className="form-label" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-solid">
                    Login
                  </button>
                </Form>
                {error && <p className="error-message">{error}</p>}
              </div>
            </Col>
            <Col lg="6" className="right-login">
              <h3>New Customer</h3>
              <div className="theme-card authentication-right">
                <h6 className="title-font">Create A Account</h6>
                <p>
                  Sign up for a free account at our store. Registration is quick
                  and easy. It allows you to be able to order from our shop. To
                  start shopping click register.
                </p>

                <button
                  className="btn btn-solid w-auto"
                  onClick={handleCreateAccountRouter}
                >
                  Create an Account
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Login;
