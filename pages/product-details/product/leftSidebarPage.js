import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductTab from '../common/product-tab';
import Service from '../common/service';
import NewProduct from '../../shop/common/newProduct';
import Slider from 'react-slick';
import ImageZoom from '../common/image-zoom';
import DetailsWithPrice from '../common/detail-price';
import Filter from '../common/filter';
import { Container, Row, Col, Media } from 'reactstrap';



// Replace with your actual E-Commerce API URL and credentials
// const API_URL = 'https://medicallogowear.com/wp-json/wc/v3/products/';
// const CONSUMER_KEY = 'ck_8425a729582a4b0e6830dfa3581301ec2ee02f31';
// const CONSUMER_SECRET = 'cs_f4412e8c668a08166522ae9d2d5a034cdb5ea575';


const LeftSidebarPage = ({ pathId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productsSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    fade: true,
  };

  const productsNavSliderSettings = {
    slidesToShow: 3,
    swipeToSlide: true,
    arrows: false,
    dots: false,
    focusOnSelect: true,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://backend.tonserve.com:8000/api/products/${pathId}/`, {
          headers: {
            Accept: 'application/json',
          },
        });
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [pathId]);

 // Use this function to handle the image change in the first slider
 const handleImageChange = (index) => {
  setSelectedImageIndex(index);
  if (slider1.current) {
    slider1.current.slickGoTo(index);
  }
};

  // Update the useEffect hook that sets the state for nav1 and nav2
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, [product, selectedImageIndex]); // Include selectedImageIndex in the dependency array


  const { nav1, nav2 } = state;

  const filterClick = () => {
    document.getElementById("filter").style.left = "-15px";
  };

  const changeColorVar = (imgId) => {
    if (slider2.current) {
      slider2.current.slickGoTo(imgId);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product || !product.variations || product.variations.length === 0) {
    return <div>No products found</div>;
  }


  return (
    <section className="">
    <div className="collection-wrapper">
      <Container>
        <Row>
          
          <Col sm="3" className="collection-filter" id="filter">
            <Filter />
            <Service />
            <NewProduct />
          </Col>
          <Col lg="9" sm="12" xs="12">
            <Container fluid={true}>
              <Row>
                <Col xl="12" className="filter-col">
                  <div className="filter-main-btn mb-2">
                    <span onClick={filterClick} className="filter-btn">
                      <i className="fa fa-filter" aria-hidden="true"></i> filter
                    </span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="product-thumbnail">
                <Slider
            {...productsSliderSettings}
            asNavFor={nav2}
            ref={slider1}
            className="product-slick"
            beforeChange={(oldIndex, newIndex) => setSelectedImageIndex(newIndex)}
          >
            {product.variations.map((item, index) => (
              <div key={index}>
                <ImageZoom
                  image={{
                    src: `https://www.alphabroder.com/media/hires/${item.front_image}`,
                  }}
                />
              </div>
            ))}
          </Slider>
          <Slider
            className="slider-nav"
            {...productsNavSliderSettings}
            asNavFor={nav1}
            ref={slider2}
          >
            {product.variations.map((item, index) => (
              <div key={index} onClick={() => handleImageChange(index)}>
                <Media
                  src={`https://www.alphabroder.com/media/hires/${item.front_image}`}
                  alt={`Product image ${index + 1}`}
                  className="img-fluid"
                />
             Product image: {index + 1}
              </div>
            ))}
          </Slider>
                </Col>
                <Col lg="6" className="rtl-text">
                  <DetailsWithPrice
                    item={product}
                    changeColorVar={changeColorVar}
                  />
                </Col>
              </Row>
            </Container>
            <ProductTab
               item={product}
            />
          </Col>
        </Row>
      </Container>
    </div>
  </section>
  );
};

export default LeftSidebarPage;
