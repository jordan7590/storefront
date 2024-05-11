import React, { useState, useContext, useEffect } from "react";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import axios from 'axios';

const Category = () => {
  const context = useContext(FilterContext);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const setSelectedCategory = context.setSelectedCategory;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // WooCommerce API endpoint
        const response = await axios.get(
          'https://tonserve.com/hfh/wp-json/wc/v3/products/categories',
          {
            auth: {
              username: 'ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2',
              password: 'cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea'
            }
          }
        );

        // Modify the response structure to match your existing data structure
        const formattedCategories = response.data.map(item => ({
          id: item.id.toString(), // Convert to string if necessary
          name: item.name,
          parent: item.parent ? item.parent.toString() : null, // Handle parent category
        }));

        setCategories(formattedCategories);
        console.log(formattedCategories);

      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderCategoryList = categories => {
    return categories.map(category => (
      <li key={category.id}>
        <a href={null} onClick={() => setSelectedCategory(category.id)}>
          {category.name}
        </a>
      </li>
    ));
  };

  return (
    <div className="collection-collapse-block open">
      <h3 className="collapse-block-title" onClick={toggleCategory}>
        Category
      </h3>
      <Collapse isOpen={isCategoryOpen}>
        <div className="collection-collapse-block-content">
          <div className="collection-brand-filter" style={{maxHeight:'none'}}>
            <ul className="category-list">
              {renderCategoryList(categories)}
            </ul>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Category;
