import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";

const getLocalCartItems = () => {
  try {
    const list = localStorage.getItem("cartList");
    if (list === null) {
      return [];
    } else {
      return JSON.parse(list);
    }
  } catch (err) {
    return [];
  }
};

const CartProvider = (props) => {
  const [cartItems, setCartItems] = useState(getLocalCartItems());
  const [cartTotal, setCartTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("InStock");

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0);
    const roundedTotal = parseFloat(total.toFixed(2)); // Round the total to 2 decimal places
    setCartTotal(roundedTotal); // Store the rounded total in the state
    localStorage.setItem("cartList", JSON.stringify(cartItems));
  }, [cartItems]);
  

  // Add Product To Cart
const addToCart = (product, selectedColor, selectedSizesQuantities, totalPrice ) => {
  toast.success("Product Added Successfully !");


  const newProduct = {
    ...product,
    color: selectedColor,
    sizesQuantities: selectedSizesQuantities,
    totalPrice
  };

  setCartItems([...cartItems, newProduct]);
  console.log([...cartItems, newProduct]);

};

const removeFromCart = (product) => {
  toast.error("Product Removed Successfully !");
  
  // Filter out the specific product to remove based on its ID or another unique identifier
  const updatedCartItems = cartItems.filter((item) => item.product_number !== product.product_number);
  setCartItems(updatedCartItems);
};

 // Decrement Product Quantity
 const minusQty = (product) => {
  if (quantity > 1) {
    setQuantity(quantity - 1);
  } else {
    toast.error("You can't have less than one item.");
  }
};

// Increment Product Quantity
const plusQty = () => {
  // Simply increments the quantity by 1
  setQuantity(quantity + 1);
};
  
  // Update Product Quantity
  const updateQty = (product, quantity) => {
    if (quantity >= 1 && product.stock_status === "instock") {
      const index = cartItems.findIndex((itm) => itm.id === product.id);
      if (index !== -1) {
        cartItems[index] = {
          ...product,
          qty: quantity,
          total: product.price * quantity,
        };
        setCartItems([...cartItems]);
        toast.info("Product Quantity Updated !");
      } else {
        toast.error("Product is Out of Stock !");
      }
    } else {
      toast.error("Enter Valid Quantity or Check Stock !");
    }
  };


  return (
    <Context.Provider
    value={{
      ...props,
      state: cartItems,
      cartTotal,
      setQuantity,
      quantity,
      addToCart: addToCart,
      removeFromCart: removeFromCart,
      plusQty: plusQty,
      minusQty: minusQty,
      updateQty: updateQty,
    }}
  >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;
