import React from 'react'
import {connect} from 'react-redux'
import {fetchProducts} from '../reducers/products'

export function AllProducts (props) {
  const products = props.products;
  return(<div className="allProducts">
      <div id="product-grid">
      {products.map(product => (
        <li key={product.id}>
         <div className="row">
           <div className="product-card col-sm-6 col-md-4">
              <img src={product.photoUrl} className="product-img"/>
              <h3>{product.name}</h3>
              <h2>{product.price}</h2>
              <p className="product-desc">{product.description}</p>
              <button type="button" className="btn btn-default">
                <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>
                Add to cart
              </button>
           </div>
         </div>
        </li>
      ))}
      </div>
    </div>);
}

function MapSetToProps(state){
 return  {
   products: state.products
  }
}

export default connect (MapSetToProps)(AllProducts);





