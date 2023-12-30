import React from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Col, Media, Form, Label, Input } from "reactstrap";

const Data = [
  {
    img: "fa-phone",
    title: "Contact us",
    desc1: "Customer Service: 810.547.1646",
    desc2: "Sales: 810.624.4445",
  },
  {
    img: "fa-map-marker",
    title: "Shipping address",
    desc1: "Hoyt & Company 12555 N. Saginaw Rd.",
    desc2: "Clio, MI 48420",
  },
  {
    img: "fa-map-marker",
    title: "Mailing order forms",
    desc1: "Hoyt & Company PO Box 182",
    desc2: "Clio, MI 48420",
  },
  {
    img: "fa-envelope-o",
    title: "Email",
    desc1: "sales@hoytcompany.com",
    desc2: "sales@medicallogowear.com",
  },
];

const ContactDetail = ({ img, title, desc1, desc2 }) => {
  return (
    <li>
      <div className="contact-icon">
        <i className={`fa ${img}`} aria-hidden="true"></i>
        <h6>{title}</h6>
      </div>
      <div className="media-body">
        <p>{desc1}</p>
        <p>{desc2}</p>
      </div>
    </li>
  );
};


const Contact = () => {
  return (
    <CommonLayout parent="home" title="Contact">
      <section className="contact-page section-b-space">
        <Container>
          <Row className="section-b-space">
            <Col lg="7" className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11635.590117161715!2d-83.725397!3d43.1906609!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88238faeb32a73d1%3A0xaaad431bf26220a9!2sHoyt%20%26%20Company%20-%20Screen%20Printing%20and%20Embroidery!5e0!3m2!1sen!2sin!4v1700587518141!5m2!1sen!2sin"
                allowFullScreen
              ></iframe>
            </Col>
            <Col lg="5">
              <div className="contact-right">
                <ul>
                  {Data.map((data, i) => {
                    return (
                      <ContactDetail
                        key={i}
                        img={data.img}
                        title={data.title}
                        desc1={data.desc1}
                        desc2={data.desc2}
                      />
                    );
                  })}
                </ul>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Form className="theme-form">
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="name">First Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter Your name"
                      required=""
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">Last Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Email"
                      required=""
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="review">Phone number</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="review"
                      placeholder="Enter your number"
                      required=""
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">Email</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      required=""
                    />
                  </Col>
                  <Col md="12">
                    <Label className="form-label" for="review">Write Your Message</Label>
                    <textarea
                      className="form-control"
                      placeholder="Write Your Message"
                      id="exampleFormControlTextarea1"
                      rows="6"
                    ></textarea>
                  </Col>
                  <Col md="12">
                    <button className="btn btn-solid" type="submit">
                      Send Your Message
                    </button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Contact;
