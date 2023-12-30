import React, { useState, useContext } from "react";
import Link from "next/link";
import sizeChart from "../../../public/assets/images/size-chart.jpg";
import { Modal, ModalBody, ModalHeader, Media, Input } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import CountdownComponent from "../../../components/common/widgets/countdownComponent";
import MasterSocial from "./master_social";
import { toast } from "react-toastify";

const DetailsWithPrice = ({ item, stickyClass }) => {
  const [modal, setModal] = useState(false);
  const CurContect = useContext(CurrencyContext);
  const symbol = CurContect.state.symbol;
  const toggle = () => setModal(!modal);
  const product = item;
  const context = useContext(CartContext);
  const stock = context.stock;
  const plusQty = context.plusQty;
  const minusQty = context.minusQty;
  const quantity = context.quantity;
  const uniqueColor = [];
  const uniqueSize = [];
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizes, setSizes] = useState([]);
  const [selectedItemNumber, setSelectedItemNumber] = useState(""); // State to hold the selected item_number
  const [selectedItemTotalStock, setSelectedItemTotalStock] = useState(""); 
  const [selectedItemRetailPrice, setSelectedItemRetailPrice] = useState(""); 
  const [isInStock, setIsInStock ] = useState("false"); 
  const [sizeQuantities, setSizeQuantities] = useState({}); // State to hold quantities for each size


  // const isInStock = product.stock_status === "instock";

  const findLowestAndHighestPrices = (product) => {
    if (!product || !product.products || product.products.length === 0) {
      return { lowestPrice: null, highestPrice: null };
    }
  
    let lowestPrice = parseFloat(product.products[0].price.retail_price);
    let highestPrice = parseFloat(product.products[0].price.retail_price);
  
    for (let i = 1; i < product.products.length; i++) {
      const currentPrice = parseFloat(product.products[i].price.retail_price);
      if (currentPrice < lowestPrice) {
        lowestPrice = currentPrice;
      }
      if (currentPrice > highestPrice) {
        highestPrice = currentPrice;
      }
    }
  
    return { lowestPrice, highestPrice };
  };
  
  const { lowestPrice, highestPrice } = findLowestAndHighestPrices(product);
 

 // Function to check if at least one size has a quantity greater than zero
 const isSizeSelected = () => {
  for (const size in sizeQuantities) {
    if (sizeQuantities.hasOwnProperty(size) && sizeQuantities[size] > 0) {
      return true;
    }
  }
  return false;
};

  const handleAddToCart = () => {
    const selectedSizesQuantities = [];
    const totalPrice  = calculateTotalPrice();
    // Iterate through sizeQuantities to gather information about selected sizes and quantities
    for (const size in sizeQuantities) {
      if (sizeQuantities.hasOwnProperty(size) && sizeQuantities[size] > 0) {
        const selectedItem = product.products.find(
          (prod) => prod.color_code === selectedColor && prod.size === size
        );
  
        if (selectedItem) {
          // Create an object containing size, quantity, and item_number
          const sizeQuantityInfo = {
            size: size,
            quantity: sizeQuantities[size],
            item_number: selectedItem.item_number
          };
  
          // Push the size, quantity, and item_number object to selectedSizesQuantities array
          selectedSizesQuantities.push(sizeQuantityInfo);
        }
      }
    }
  
    // Call addToCart method in CartContext with the product, selectedColor, and selectedSizesQuantities
    context.addToCart(product, selectedColor, selectedSizesQuantities, totalPrice );
    // console.log(product, selectedColor, selectedSizesQuantities);
  };
  


  
// Update the quantity for a specific size
const handleSizeQuantityChange = (size, quantity) => {
  const availableStock = getAvailableStock(size);
  const newQuantities = { ...sizeQuantities, [size]: quantity > availableStock ? availableStock : quantity };
  setSizeQuantities(newQuantities);

  // Log message when user crosses the maximum available stock
  if (quantity > availableStock) {
    // console.log(`User exceeded the maximum available stock for ${size} : ${availableStock}.`);
    toast.error(`Maximum available stock for ${size} :  ${availableStock}.`);

  }
};
// Function to get available stock for a particular size
const getAvailableStock = (size) => {
  const selectedItem = product.products.find(
    (prod) => prod.color_code === selectedColor && prod.size === size
  );

  if (selectedItem && selectedItem.inventory) {
    return selectedItem.inventory.total_sum || 0;
  }

  return 0;
};

  // Get all available sizes for the selected color
  const availableSizes = selectedColor
    ? product.products
        .filter((prod) => prod.color_code === selectedColor)
        .map((prod) => prod.size)
    : [];

  // Render quantity inputs for each available size
  const renderSizeQuantities = () => {
    return availableSizes.map((size, index) => {
      const availableStock = getAvailableStock(size);
      const maxQuantity = availableStock > 0 ? availableStock : 0;
      const selectedItem = product.products.find(
        (prod) => prod.color_code === selectedColor && prod.size === size
      );
  
      return (
        <div key={index} className="size-quantity-input">
          {/* <p>Item Number: {selectedItem ? selectedItem.item_number : "-"}</p> */}
          <p className="size-box-price">{symbol}{selectedItem ? selectedItem.price.retail_price : "-"}</p>
          <span className="size-box-span">
          <input
            className="size-box-input"
            type="number"
            min="0"
            max={maxQuantity}
            value={sizeQuantities[size] || 0}
            onChange={(e) => handleSizeQuantityChange(size, parseInt(e.target.value))}
          />
          </span>
          
          <span className="size-box-size-value">{size}</span>

          {/* <p> Stock: {availableStock}</p> */}
        </div>
      );
    });
  };
          {/* <p>Item Number: {selectedItem ? selectedItem.item_number : "-"}</p> */}

          const calculateTotalPrice = () => {
            let totalPrice = 0;
          
            for (const size in sizeQuantities) {
              if (sizeQuantities.hasOwnProperty(size)) {
                const quantity = sizeQuantities[size];
                const selectedItem = product.products.find(
                  (prod) => prod.color_code === selectedColor && prod.size === size
                );
          
                if (selectedItem && quantity > 0) {
                  totalPrice += selectedItem.price.retail_price * quantity;
                }
              }
            }
          
            // Format totalPrice to two decimal places
            return totalPrice.toFixed(2);
          };


  const handleColorChange = (e) => {
    const selectedColorCode = e.target.value;
    setSelectedColor(selectedColorCode);
  
    const selectedColorInfo = product.products.find((prod) => prod.color_code === selectedColorCode);
    if (selectedColorInfo) {
      // Set the selected color's name and code
      const { color_code, color_name, hex_code } = selectedColorInfo;
      // You can use these values wherever needed in your component
      console.log(`Selected Color Code: ${color_code}`);
      console.log(`Selected Color Name: ${color_name}`);
      console.log(`Selected Color Hex Code: ${hex_code}`);

      // Rest of your existing logic...
  
      // Rest of your existing logic...
      // Update the local state with sizes
      setSizes(selectedColorInfo.size);
      setSelectedItemNumber(""); // Reset item_number when color changes

 // Reset all quantities for sizes to 0 when color changes
 if (Array.isArray(selectedColorInfo.size)) {
  const resetQuantities = {};
  selectedColorInfo.size.forEach((size) => {
    resetQuantities[size] = 0;
  });
  setSizeQuantities(resetQuantities);
} else {
  // Handle the case when size is not in the expected format
  setSizeQuantities({});
}
}
  };

  // Extracting unique color options from the provided JSON and removing duplicates
  const uniqueColors = Array.from(new Set(product.products.map((prod) => prod.color_code)));

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    const selectedItem = product.products.find(
      (prod) => prod.color_code === selectedColor && prod.size === e.target.value
    );
    if (selectedItem) {
      setSelectedItemNumber(selectedItem.item_number); // Set the item_number for the selected combination
      setSelectedItemTotalStock(selectedItem.inventory.total_sum); 
      setIsInStock(selectedItem.inventory.total_sum > 0); // Set isInStock based on the total stock count
      setSelectedItemRetailPrice(selectedItem.price.retail_price); // Set the item_number for the selected combination
    }
  };








  const changeQty = (e) => {
    let value = parseInt(e.target.value);
    if (value < 1) {
      toast.error("Quantity cannot be less than 1.");
      value = 1;
    }
    context.setQuantity(value);
  };


 // Assuming `colorOptions` is derived from `product.attributes`
//  const colorOptions = product?.attributes?.find(
//   (attr) => attr.name === "Color"
// )?.options ?? [];

// const [selectedColor, setSelectedColor] = useState(colorOptions.length > 0 ? colorOptions[0] : "");

// // Define handleColorChange within the component
// const handleColorChange = (e) => {
//   setSelectedColor(e.target.value);
// };


  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        <h2> {product.short_description} </h2>
        <h4>
          <del>
            {symbol}
            {product.price}
          </del>
          <span>{product.discount}% off</span>
        </h4>
        <h3>
          {symbol}
          {lowestPrice} - {highestPrice}
        </h3>

        <div className="color-selection">
  <h6 className="product-title">Color</h6>
  <select
    className="color-variant-dropdown"
    value={selectedColor}
    onChange={handleColorChange}
  >
    <option value="">Select Color</option>
    {uniqueColors.map((colorCode, index) => {
      const selectedColorInfo = product.products.find((prod) => prod.color_code === colorCode);
      return (
        <option key={index} value={colorCode}>
          {/* Display both color name and code */}
         {selectedColorInfo && `${selectedColorInfo.color_name} - #${selectedColorInfo.hex_code}`}
        </option>
      );
    })}
  </select>
</div>

     {/* Display quantity inputs for selected color's sizes */}
     {selectedColor && availableSizes.length > 0 && (
      <div className="size-area">
         <h6 className="product-title">Select Sizes & Quantities</h6>
         <a href="../assets/images/default/size-chart.jpg" target="_blank">
         <p>View Size Chart</p>
         </a>
        <div className="size-quantity-container">
          {renderSizeQuantities()}
        </div>  
      </div>
        
      )}
      
 

      {/* Display selected item_number */}
      {/* {selectedItemNumber && (
        <div className="selected-item-number">
          <p>Selected Item Number: {selectedItemNumber}</p>
          <p>Stock Available: {selectedItemTotalStock}</p>
          <p>Retail Price: {selectedItemRetailPrice}</p>
        </div>
      )} */}

      
      <p>Total Price: {symbol}{calculateTotalPrice()}</p>
      <p>
        <span>
        Production time:
        </span>
        Standard -15 Business days
      </p>

        {/* <div className="color-selection">
  <h6 className="product-title">Color</h6>
  <select
    className="color-variant-dropdown"
    value={selectedColor}
    onChange={handleColorChange}
  >
    {colorOptions.map((color, index) => (
      <option key={index} value={color} style={{ backgroundColor: color }}>
        {color}
      </option>
    ))}
  </select>
</div> */}
      {/* Similar logic would apply for size selection, assuming sizeOptions is defined */} 
      {/* <div className="size-selection">
        <h6 className="product-title">Size</h6>
        <select className="size-variant-dropdown">
          {sizeOptions.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div> */}
       {/* <div className="product-description border-product">
          <span className="instock-cls">{isInStock ? 'In Stock' : 'Out of Stock'}</span>
          <h6 className="product-title">quantity</h6>
          {isInStock && (
            <div className="qty-box">
              <div className="input-group">
                <span className="input-group-prepend">
                  <button
                    type="button"
                    className="btn quantity-left-minus"
                    onClick={context.minusQty}
                    data-type="minus"
                    data-field=""
                  >
                    <i className="fa fa-angle-left"></i>
                  </button>
                </span>
                <Input
                  type="text"
                  name="quantity"
                  value={context.quantity}
                  onChange={changeQty}
                  className="form-control input-number"
                />
                <span className="input-group-prepend">
                  <button
                    type="button"
                    className="btn quantity-right-plus"
                    onClick={() => context.plusQty(product)}
                    data-type="plus"
                    data-field=""
                  >
                    <i className="fa fa-angle-right"></i>
                  </button>
                </span>
              </div>
            </div>
          )}
        </div> */}
        <div className="border-product">
          {isInStock ? (
            <div className="product-buttons">
              <button
                className="btn btn-solid"
                onClick={handleAddToCart} // to call the handleAddToCart function
                disabled={!isSizeSelected()} // Disable button if no size with quantity selected
              >
                add to cart
              </button>
              {/* <Link href={`/page/account/checkout`}>
                <a className="btn btn-solid">buy now</a>
              </Link> */}
            </div>
          ) : (
            <div className="product-buttons">
              <button className="btn btn-solid" disabled>
                add to cart
              </button>
              {/* <button className="btn btn-solid" disabled>
                buy now
              </button> */}
            </div>
          )}
        </div>

        {/* <div className="border-product">
          <h6 className="product-title">product details</h6>
          <p>{product.description}</p>
        </div> */}
        <div className="border-product">
          <h6 className="product-title">share it</h6>
          <div className="product-icon">
            <MasterSocial />
          </div>
        </div>
        {/* <div className="border-product">
          <h6 className="product-title">Time Reminder</h6>
          <CountdownComponent />
        </div> */}
      </div>
    </>
  );
};

export default DetailsWithPrice;
