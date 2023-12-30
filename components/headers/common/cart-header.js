import React, { Fragment, useContext } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { Media } from "reactstrap";
const defaultImageUrl = "../../../assets/images/default/default-product-image.jpg";


const CartHeader = ({ item, symbol }) => {
  const context = useContext(CartContext);
  return (
    <Fragment>
      <li>
        <div className="media">
          <Link href={"/product-details/" + item.style_number}>
            <a>
            {item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ? (
                <Media
                  src={`https://www.alphabroder.com/media/hires/${item.products.find(product => product.item_number === item.sizesQuantities[0].item_number).front_image}`}
                  alt=""
                />
              ) : (
                <img src={defaultImageUrl} alt="Default" />
              )} 
           </a>
          </Link>
          <div className="media-body">
            <Link href={"/product-details/" + item.style_number}>
              <a>
                <h6>{item.short_description}</h6>
              </a>
            </Link>

            <h4>
              <span>
                {item.qty} x {symbol}
                {item.totalPrice}
              </span>
            </h4>
          </div>
        </div>
        <div className="close-circle">
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={() => context.removeFromCart(item)}
          ></i>
        </div>
      </li>
    </Fragment>
  );
};

export default CartHeader;
