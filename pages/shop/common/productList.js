import React, { useState, useContext, useEffect } from "react";
import {
  Col,
  Row,
  Media,
  Button,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import Menu2 from "../../../public/assets/images/mega-menu/2.jpg";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import FilterContext from "../../../helpers/filter/FilterContext";
import ProductItem from "../../../components/common/product-box/ProductBox1";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import { useRouter } from "next/router";
import PostLoader from "../../../components/common/PostLoader";
import CartContext from "../../../helpers/cart";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import axios from "axios";
import { UniqueOperationTypesRule } from "graphql";

// Replace with your actual E-Commerce API URL and credentials
// const API_URL = "https://medicallogowear.com/wp-json/wc/v3/";
// const CONSUMER_KEY = "ck_8425a729582a4b0e6830dfa3581301ec2ee02f31";
// const CONSUMER_SECRET = "cs_f4412e8c668a08166522ae9d2d5a034cdb5ea575";

const ProductList = ({ colClass, layoutList, openSidebar, noSidebar }) => {
  const cartContext = useContext(CartContext);
  const quantity = cartContext.quantity;
  const wishlistContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const router = useRouter();
  const [limit, setLimit] = useState(20);
  const curContext = useContext(CurrencyContext);
  const [grid, setGrid] = useState(colClass);
  const symbol = curContext.state.symbol;
  const filterContext = useContext(FilterContext);
  const selectedBrands = filterContext.selectedBrands;
  const selectedColor = filterContext.selectedColor;
  const selectedPrice = filterContext.selectedPrice;
  const selectedCategory = filterContext.state;
  const selectedSize = filterContext.selectedSize;
  const [sortBy, setSortBy] = useState("asc");
  const [layout, setLayout] = useState(layoutList);
  const [url, setUrl] = useState();
  // State to store fetched products
  const [products, setProducts] = useState([]);
  // State to handle loading status
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [totalCount, setTotalCount] = useState(0); // Total number of Products
  const [currentPage, setCurrentPage] = useState(1); // Current page
  // routeing here

  useEffect(() => {
    const pathname = window.location.pathname;
    setUrl(pathname);
    router.push(
      `${pathname}?${filterContext.state}&brand=${selectedBrands}&color=${selectedColor}&size=${selectedSize}&minPrice=${selectedPrice.min}&maxPrice=${selectedPrice.max}`,
      undefined,
      { shallow: true }
    );
  }, [selectedBrands, selectedColor, selectedSize, selectedPrice]);

  // Reset the current page when selectedCategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
  
        let apiUrl = `https://tonserve.com/hfh/wp-json/wc/v3/products?per_page=${limit}&page=${currentPage}&order=${sortBy}`;
  
        if (selectedCategory) {
          apiUrl += `&category=${selectedCategory}`;
        }
  
        const response = await axios.get(apiUrl, {
          auth: {
            username: 'ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2',
            password: 'cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea'
          }
        });

        // Debugging logs
        console.log("Received products:", response.data);
        console.log("Total products:", response.data.count);
        console.log("Selected Cat:", selectedCategory);
        console.log("Filtered products:", response.data.results);
        console.log("Selected Page:", currentPage);
  
        setTotalCount(response.headers['x-wp-total']);
        setTotalPages(response.headers['x-wp-totalpages']);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, [selectedCategory, limit, currentPage, sortBy]);

  

  // Pagination Component
  const PaginationComponent = ({
    currentPage,
    totalPages,
    handlePageChange,
  }) => {
    const displayPages = 5; // Number of page numbers to display

    const getPageNumbers = () => {
      if (totalPages <= displayPages) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
      }

      const middleIndex = Math.floor(displayPages / 2);
      let start = currentPage - middleIndex;
      let end = currentPage + middleIndex;

      if (currentPage <= middleIndex) {
        start = 1;
        end = displayPages;
      } else if (currentPage >= totalPages - middleIndex) {
        start = totalPages - displayPages + 1;
        end = totalPages;
      }

      return Array.from(
        { length: end - start + 1 },
        (_, index) => start + index
      );
    };

    const pageNumbers = getPageNumbers();

    return (
      <Pagination aria-label="Products Pagination" className="custom-pagination">
      <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            className="custom-pagination-link"
            previous
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        {currentPage > displayPages / 2 && totalPages > displayPages && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)} href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem disabled>
              <PaginationLink>...</PaginationLink>
            </PaginationItem>
          </>
        )}

        {pageNumbers.map((page) => (
          <PaginationItem key={page} active={currentPage === page}>
            <PaginationLink onClick={() => handlePageChange(page)} href="#">
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage <= totalPages - displayPages / 2 &&
          totalPages > displayPages && (
            <>
              <PaginationItem disabled>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  href="#"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            next
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </Pagination>
    );
  };

  // Function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //infinity scroll

  const removeBrand = (val) => {
    const temp = [...selectedBrands];
    temp.splice(selectedBrands.indexOf(val), 1);
    filterContext.setSelectedBrands(temp);
  };

  const removeSize = (val) => {
    const temp = [...selectedSize];
    temp.splice(selectedSize.indexOf(val), 1);
    filterContext.setSelectedSize(temp);
  };

  const removeColor = () => {
    filterContext.setSelectedColor("");
  };

  return (
    <Col className="collection-content">
      <div className="page-main-content">
        <Row>
          <Col sm="12">
            {/* banner to paragraph  */}

            <div className="top-banner-wrapper">
              <a href={null}>
                <Media
                  src={Menu2}
                  className="img-fluid blur-up lazyload"
                  alt=""
                />
              </a>
              <div className="top-banner-content small-section">
                <h4>Yo Fashion</h4>
                <h5>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </h5>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
            </div>

            {/* Filter Tags  */}
            <Row>
              <Col xs="12">
                <ul className="product-filter-tags">
                  {selectedBrands.map((brand, i) => (
                    <li key={i}>
                      <a href={null} className="filter_tag">
                        {brand}
                        <i
                          className="fa fa-close"
                          onClick={() => removeBrand(brand)}
                        ></i>
                      </a>
                    </li>
                  ))}
                  {selectedColor ? (
                    <li>
                      <a href={null} className="filter_tag">
                        {selectedColor}
                        <i className="fa fa-close" onClick={removeColor}></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {selectedSize.map((size, i) => (
                    <li key={i}>
                      <a href={null} className="filter_tag">
                        {size}
                        <i
                          className="fa fa-close"
                          onClick={() => removeSize(size)}
                        ></i>
                      </a>
                    </li>
                  ))}
                  {
                    <li>
                      <a href={null} className="filter_tag">
                        price: {selectedPrice.min}- {selectedPrice.max}
                      </a>
                    </li>
                  }
                </ul>
              </Col>
            </Row>

            <div className="collection-product-wrapper">
              {/* Product Filter  */}

              <div className="product-top-filter">
                {!noSidebar ? (
                  <Row>
                    <Col xl="12">
                      <div
                        className="filter-main-btn"
                        onClick={() => openSidebar()}
                      >
                        <span className="filter-btn btn btn-theme">
                          <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                          Filter
                        </span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
                <Row>
                  <Col>
                    <div className="product-filter-content">
                      <div className="search-count">
                        <h5>
                          {products
                            ? `Showing Products 1-${products.length} of ${totalCount}`
                            : "loading"}{" "}
                          Result
                        </h5>
                      </div>
                      <div className="collection-view">
                        <ul>
                          <li>
                            <i
                              className="fa fa-th grid-layout-view"
                              onClick={() => {
                                setLayout("");
                                setGrid("col-lg-3");
                              }}
                            ></i>
                          </li>
                          <li>
                            <i
                              className="fa fa-list-ul list-layout-view"
                              onClick={() => {
                                setLayout("list-view");
                                setGrid("col-lg-12");
                              }}
                            ></i>
                          </li>
                        </ul>
                      </div>
                      <div
                        className="collection-grid-view"
                        style={
                          layout === "list-view"
                            ? { visibility: "hidden" }
                            : { visibility: "visible" }
                        }
                      >
                        <ul>
                          <li>
                            <Media
                              src={`/assets/images/icon/2.png`}
                              alt=""
                              className="product-2-layout-view"
                              onClick={() => setGrid("col-lg-6")}
                            />
                          </li>
                          <li>
                            <Media
                              src={`/assets/images/icon/3.png`}
                              alt=""
                              className="product-3-layout-view"
                              onClick={() => setGrid("col-lg-4")}
                            />
                          </li>
                          <li>
                            <Media
                              src={`/assets/images/icon/4.png`}
                              alt=""
                              className="product-4-layout-view"
                              onClick={() => setGrid("col-lg-3")}
                            />
                          </li>
                          <li>
                            <Media
                              src={`/assets/images/icon/6.png`}
                              alt=""
                              className="product-6-layout-view"
                              onClick={() => setGrid("col-lg-2")}
                            />
                          </li>
                        </ul>
                      </div>
                      <div className="product-page-per-view">
                        <select
                          onChange={(e) => setLimit(parseInt(e.target.value))}
                        >
                          <option value="20">20 Products Per Page</option>
                          <option value="50">50 Products Per Page</option>
                          <option value="100">100 Products Per Page</option>
                        </select>
                      </div>
                      <div className="product-page-filter">
                        <select onChange={(e) => setSortBy(e.target.value)}>
                          <option value="asc">Sorting items</option>
                          <option value="HighToLow">High To Low</option>
                          <option value="LowToHigh">Low To High</option>
                          <option value="Newest">Newest</option>
                          <option value="asc">Asc Order</option>
                          <option value="desc">Desc Order</option>
                        </select>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Products List  */}

              <div className={`product-wrapper-grid ${layout}`}>
                <Row>
                  {/* Product Box */}
                  {isLoading
                    ? // Render loaders when fetching data
                      // Render the same number of loaders as the per_page limit
                      Array.from({ length: limit }, (_, index) => (
                        <div className={grid} key={index}>
                          <PostLoader />
                        </div>
                      ))
                    : products.map((product, i) => (
                        <div className={grid} key={i}>
                          <div className="product">
                            <div>
                              <ProductItem
                                des={true}
                                product={product}
                                symbol={symbol}
                                backImage={true}
                                cartClass="cart-info cart-wrap"
                                addCompare={() =>
                                  compareContext.addToCompare(product)
                                }
                                addWishlist={() =>
                                  wishlistContext.addToWish(product)
                                }
                                addCart={() =>
                                  cartContext.addToCart(product, quantity)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                </Row>
              </div>

              {/* Load More / Pagination  */}

              <div className="section-t-space">
                <div className="text-center">
                  <Row>
                    <Col xl="12" md="12" sm="12">
                      {/* Pagination Component */}

                      <div
                        className="pagination-section"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <PaginationComponent
                          currentPage={currentPage}
                          totalPages={totalPages}
                          handlePageChange={handlePageChange}
                        />{" "}
                      </div>

                      {/* infinity scroll */}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ProductList;
