import React from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from '../../../pages/page/account/AuthContext'; 



const TopBarDark = ({ topClass, fluid }) => {
  const router = useRouter();
  const { logout } = useAuth(); // Accessing logout function from context

  const handleLogout = () => {
		logout(); // Call logout function when the logout link is clicked
    router.push("/page/account/login");
	  };


  return (
    <div className={topClass}>
      <Container fluid={fluid}>
        <Row>
          <Col lg="6">
            <div className="header-contact">
              <ul>
                 <li>
                  <i className="fa fa-envelope text-white" aria-hidden="true"></i><a href="mailto:sales@hoytcompany.com" className="text-secondary">sales@hoytcompany.com</a>
                </li>
                <li>
                  <i className="fa fa-phone text-white" aria-hidden="true"></i><a href="tel:+1(810)547-1646" className="text-secondary">Customer Service: 810.547.1646</a>
                </li>
              </ul>
            </div>
          </Col>
          <Col lg="6" className="text-end">
            <ul className="header-dropdown">
              <li className="mobile-wishlist">
                <Link href="/page/account/wishlist">
                  <a>
                    <i className="fa fa-heart" aria-hidden="true"></i> wishlist
                  </a>
                </Link>
              </li>
              <li className="onhover-dropdown mobile-account">
                <i className="fa fa-user" aria-hidden="true"></i> My Account
                <ul className="onhover-show-div">
                  <li>
                    <Link href={`/page/account/login`}>
                      <a>Login</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={`/page/account/register`}>
                      <a>Register</a>
                    </Link>
                  </li>
                  <li onClick={() => handleLogout()}>
                    <a>Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
