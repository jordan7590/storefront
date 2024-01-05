import React, { useContext, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Row, Col, Container } from 'reactstrap';
import ProductItems from '../product-box/ProductBox1';
import PostLoader from '../PostLoader';
import CartContext from '../../../helpers/cart';
import { WishlistContext } from '../../../helpers/wishlist/WishlistContext';
import { CompareContext } from '../../../helpers/Compare/CompareContext';
import axios from 'axios'; // You might need to install axios


const TopCollection = ({
  type,
  title,
  subtitle,
  designClass,
  noSlider,
  cartClass,
  productSlider,
  titleClass,
  noTitle,
  innerClass,
  inner,
  backImage,
}) => {
  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);
  const compareList = useContext(CompareContext);
  const [products, setProducts] = useState([]);
  const [delayProduct, setDelayProduct] = useState(true);
  console.log('noSlider value is:', noSlider);
  const shouldDisplaySlider = noSlider === "true" || noSlider === true;



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend.tonserve.com:8000/api/products/?page=1&page_size=8');
        setProducts(response.data.results); // Assuming the data structure has a 'results' key containing an array of products
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Handle error responses here, e.g., set an error state
      } finally {
        setDelayProduct(false); // Presumably you're controlling a loading state with this
      }
    };
  
    fetchProducts();
  }, []);

  // ProductSlider settings or your default settings for react-slick
  const sliderSettings = productSlider || {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <section className={designClass}>
      {!noTitle && (
        <div className={titleClass ? titleClass : ''}>
          {subtitle && <h4>{subtitle}</h4>}
          <h2 className={innerClass ? innerClass : ''}>{title}</h2>
          <hr role="tournament6" />
        </div>
      )}
      <Container>
        {delayProduct ? (
          <Row>
            {[...Array(4)].map((_, index) => (
              <Col key={index} xl="3" lg="4" md="6">
                <PostLoader />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            {products.length === 0 ? (
              <div>No products found</div>
            ) : shouldDisplaySlider  ? (
              products.map((product, index) => (
                <Col key={index} xl="3" sm="6">
                  <ProductItems
                    product={product}
                    backImage={backImage}
                    addCompare={() => compareList.addToCompare(product)}
                    addWishlist={() => wishlistContext.addToWish(product)}
                    addCart={() => cartContext.addToCart(product, 1)} // assuming the quantity is always 1 for simplicity
                    cartClass={cartClass}
                  />
                </Col>
              ))
            ) : (
              <Slider {...sliderSettings} className="product-m no-arrow">
                {products.map((product, index) => (
                  <div key={index}>
                    <ProductItems
                      product={product}
                      backImage={backImage}
                      addCompare={() => compareList.addToCompare(product)}
                      addWishlist={() => wishlistContext.addToWish(product)}
                      addCart={() => cartContext.addToCart(product, 1)}
                      cartClass={cartClass}
                    />
                  </div>
                ))}
              </Slider>
            )}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default TopCollection;
