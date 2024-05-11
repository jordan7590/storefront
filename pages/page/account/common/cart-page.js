import React, { useState, useContext } from "react";
import Link from "next/link";
import CartContext from "../../../../helpers/cart";
import { Container, Row, Col, Media, Input } from "reactstrap";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import cart from "../../../../public/assets/images/icon-empty-cart.png";
const defaultImageUrl = "../../../assets/images/default/default-product-image.jpg";

const CartPage = () => {
  const context = useContext(CartContext);
  const cartItems = context.state;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const total = context.cartTotal;
  const removeFromCart = context.removeFromCart;
  const [quantity, setQty] = useState(1);
  const [quantityError, setQuantityError] = useState(false);
  const updateQty = context.updateQty;

  

  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">image</th>
                      <th scope="col">product name</th>
                      <th scope="col">Size / Quantity </th>
                      <th scope="col">action</th>
                      <th scope="col">total</th>
                    </tr>
                  </thead>
                  {cartItems.map((item, index) => {
                    return (
                      <tbody key={index}>
                        <tr>
                          <td>
                            <Link href={`/product-details/` + item.id}>
                              <a>
                              {item.variations && Array.isArray(item.variations) && item.variations.length > 0 && item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ? (
                                  <Media
                                    src={`https://www.alphabroder.com/media/hires/${item.variations.find(product => product.item_number === item.sizesQuantities[0].item_number)?.front_image}`}
                                    alt=""
                                  />
                              ) : (
                              <img src={defaultImageUrl} alt="Default" />
                              )}

                              </a>
                            </Link>
                          </td>
                          <td>
                            <Link href={`/product-details/` + item.id}>
                              <a>{item.name}</a>
                            </Link>
                            <p>Color: {item.color}</p>
                             
                                      <div className="mobile-cart-content row">
                                        <div className="col-xs-3">
                                          <div className="qty-box">
                                            <div className="input-group">
                                              <input
                                                type="number"
                                                name="quantity"
                                                onChange={(e) =>
                                                  handleQtyUpdate(item, e.target.value)
                                                }
                                                className="form-control input-number"
                                                defaultValue={item.qty}
                                                style={{
                                                  borderColor: quantityError && "red",
                                                }}
                                              />
                                            </div>
                                          </div>
                                          {item.qty >= item.stock ? "out of Stock" : ""}
                                        </div>
                                        <div className="col-xs-3">
                                          <h2 className="td-color">
                                            {symbol}
                                            {item.price}
                                          </h2>
                                        </div>
                                        <div className="col-xs-3">
                                          <h2 className="td-color">
                                            <a href="#" className="icon">
                                              <i
                                                className="fa fa-times"
                                                onClick={() => removeFromCart(item)}
                                              ></i>
                                            </a>
                                          </h2>
                                        </div>
                                      </div>
                          </td>
                        
                          
                          <td>
                            
                              {/* Displaying size and quantity from selectedSizesQuantities */}
                             {item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ? (
                                item.sizesQuantities.map((sizeQuantity, index) => (
                                  <div key={index}>
                                    <p style={{margin:"3px 0px"}}>{sizeQuantity.size} / {sizeQuantity.quantity}  </p>
                                    {/* <p>Total Quantity: {totalQuantity}</p> */}

                                  </div>
                                ))
                              ) : (
                                <p>No size or quantity information available.</p>
                              )}
                              {/* Display the total quantity of all items in sizesQuantities */}
                              <p>Total Quantity: {
                                item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ?
                                  item.sizesQuantities.reduce((totalQty, sizeQuantity) => totalQty + sizeQuantity.quantity, 0) :
                                  0
                              }</p>
                          </td>
                    
                          <td>
                            <i
                              className="fa fa-times"
                              onClick={() => removeFromCart(item)}
                            ></i>
                          </td>
                          <td>
                            <h2 className="td-color">
                              {symbol}
                              {item.totalPrice}
                            </h2>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
                <table className="table cart-table table-responsive-md">
                  <tfoot>
                    <tr>
                      <td>total price :</td>
                      <td>
                        <h2>
                          {symbol} {total.toFixed(2)}{" "}
                        </h2>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
            <Row className="cart-buttons">
              <Col xs="6">
                <Link href={`/shop/left_sidebar`}>
                  <a className="btn btn-solid">continue shopping</a>
                </Link>
              </Col>
              <Col xs="6">
                <Link href={`/page/account/checkout`}>
                  <a className="btn btn-solid">check out</a>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div>
                  <div className="col-sm-12 empty-cart-cls text-center">
                    <Media
                      src={cart}
                      className="img-fluid mb-4 mx-auto"
                      alt=""
                    />
                    <h3>
                      <strong>Your Cart is Empty</strong>
                    </h3>
                    <h4>Explore more shortlist some items.</h4>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default CartPage;
