import React from "react";
import Navbar from "../../component/navbar/Navbar";
import Footer from "../../component/footer/Footer";
import Stepper from "../../component/stepper/Stepper";
import "./shoppingcart.css";
import { useDispatch, useSelector } from "react-redux";
import { addItemstoCart, deleteCartItem } from "../../actions/cartactions.js";
import { toastWarning } from "../../utils/toastify.js";
import { useNavigate } from "react-router";
import TitleHelmet from "../../component/Helmet/Helmet.jsx";
import { AiOutlineDelete } from "react-icons/ai";
import cartEmpty from "../../assets/images/cartEmpty.svg";

const Shoppingcart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  // const {}

  // calculating subtotal
  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    subtotal += cartItems[i].price * cartItems[i].quantity;
  }

  const shipping = 0;

  const setupCheckout = () => {
    sessionStorage.setItem(
      "amount",
      JSON.stringify({
        subtotal,
        gst: 0,
        shippingCharge: shipping,
        totalPrice: shipping + subtotal,
      })
    );
    navigate("/checkout");
  };

  const handleDelete = (id) => {
    dispatch(deleteCartItem(id));
  };
  return (
    <>
      <TitleHelmet title="Dimvaji - Cart" />

      <Navbar />
      {cartItems.length === 0 ? (
        <div className="notFound__page">
          <img src={cartEmpty} alt="" />
          <p>Your Cart is Empty</p>
        </div>
      ) : (
        <>
          <Stepper activestep={0} />
          <div className="shopping-cart__container section__padding">
            <div className="shopping-cart__item-header">
              <div>
                <p>Product</p>
              </div>
              <div>
                <p>Quantity</p>
              </div>
              <div>
                <p>Price</p>
              </div>
              <div>
                <p>Total</p>
              </div>
              <div>
                <p>Remove</p>
              </div>
            </div>
            <div className="shopping-cart__items-container">
              {cartItems?.map((item) => (
                <ShoppingcartItem
                  handleDelete={handleDelete}
                  item={item}
                  key={item.id}
                />
              ))}
            </div>

            <div className="shopping-cart__pricing">
              <div className="shopping-cart__pricing-subtotal">
                <p>Subtotal</p>
                <p>{`৳ ${subtotal}`}</p>
              </div>
              <div className="shopping-cart__pricing-tax">
                <p>Shipping</p>
                {shipping === 0 ? <h3>Free Shipping</h3> : ""}
              </div>
              <div className="shopping-cart__total">
                <p>Total</p>
                <p>{`৳ ${shipping + subtotal}`}</p>
              </div>
            </div>

            <div className="shopping-cart__action_btn">
              <button onClick={() => navigate("/products")}>
                Continue Shopping
              </button>
              <button onClick={setupCheckout}>Chackout</button>
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

const ShoppingcartItem = ({ item, handleDelete }) => {
  const dispatch = useDispatch();
  const increaseqty = () => {
    if (item.quantity === item.stock) {
      toastWarning("Now Enough Stock");
      return;
    }
    dispatch(addItemstoCart(item, item.quantity + 1));
  };

  const decreaseqty = () => {
    if (item.quantity === 1) {
      toastWarning("Minimum Quantity is 1");
      return;
    }
    dispatch(addItemstoCart(item, item.quantity - 1));
  };
  return (
    <div className="shopping-cart__items">
      <div className="cart-items__image_name">
        <img src={item.image} alt={item.name} />
        <p>{item.name}</p>
      </div>

      <div className="cart-items__quantity">
        <button onClick={decreaseqty} className="cart-items__quantity-button">
          -
        </button>
        <p>{item.quantity}</p>
        <button onClick={increaseqty} className="cart-items__quantity-button">
          +
        </button>
      </div>

      <div className="cart-items__price">
        <p>{`৳ ${item.price}`}</p>
      </div>
      <div className="cart-items__total-price">
        <p>{`৳ ${(item.quantity * item.price).toFixed(2)}`}</p>
      </div>
      <div
        className="cart-items__delete"
        onClick={() => handleDelete(item._id)}
      >
        <AiOutlineDelete />
      </div>
    </div>
  );
};
export default Shoppingcart;
