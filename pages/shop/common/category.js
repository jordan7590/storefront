import React, { useState, useContext, useEffect } from "react";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import axios from 'axios'; // or use fetch

// Replace with your actual E-Commerce API URL and credentials
const API_URL = 'https://mobile-app-backend-node.vercel.app/auth/demo-data';
const CONSUMER_KEY = 'ck_8425a729582a4b0e6830dfa3581301ec2ee02f31';
const CONSUMER_SECRET = 'cs_f4412e8c668a08166522ae9d2d5a034cdb5ea575';


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

        const response = await axios.get(
          'http://3.22.79.158:8000/api/alp/getcategories/',
          {
            headers: {
              accept: 'application/json',
            },
          }
        );

        // Modify the response structure to match your existing data structure
        const formattedCategories = response.data.results.map(item => ({
          id: item.category, // Replace spaces and pipes with underscores to create unique IDs
          name: item.category,
          parent: null, // Assuming there are no parent categories in this API response
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
