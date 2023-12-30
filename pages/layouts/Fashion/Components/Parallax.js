import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import MasterParallaxBanner from "./MasterParallaxBanner";

const Parallax = () => {
  return (
    <Fragment>
      {/* <section className="p-0">
        <div className="full-banner parallax-banner1 parallax text-center p-left">
          <Container>
            <Row>
              <Col>
                <div className="banner-contain">
                  <h2>2022</h2>
                  <h3>fashion trends</h3>
                  <h4>special offer</h4>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section> */}
      <MasterParallaxBanner
        bg="parallax-banner1"
        parallaxClass="text-center p-left"
        title="2024"
        subTitle1="APPAREL DECORATION"
        subTitle2="TEMPLATE"
      />
    </Fragment>
  );
};

export default Parallax;
