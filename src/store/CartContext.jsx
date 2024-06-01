import { act, createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {}
});

//here state and action are paramteres values passed by react automatically
//react will be executing this function (maine kahi bhi iss function ko execute nhi kiya like this cartReducer(state,action))
//goal of this below fn is to return an updated state
//action object tells how to update this state

function cartReducer(state, action) {
  //when dispatching action later i define what is the action type and what is the item i am dispatching to here
  if (action.type === "ADD_ITEM") {
    //... update the state to add a meal item
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    ); //here when you find the index of an item which already exists in cart of items we use that index to increase the quantity of that item

    const updatedItems = [...state.items]; //copy of my old array
    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems }; //old data of state is also passed by spreading into the {} object and update the items array with new updateItems array
  }

  if (action.type === "REMOVE_ITEM") {
    //... remove an item from the state
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items]; //create a copy of old items
    if (existingCartItem.quantity === 1) {
      //remove the entire item from the shoping cart
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  if(action.type === 'CLEAR_CART'){
    return { ...state, items: []};
  }

  return state;
}

export function CartContextProvider({ children }) {
  //here write logic to manage states and function to manipulate cart data
  //useReducer allow us to manage state but makes it easier than useState
  //useReducer() needs a reducer function which is cartReducer here
  //my state is an array of items which is passed here as initial value as an empty array
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  

  function addItem(item){
    dispatchCartAction({type: 'ADD_ITEM',item});
  } 

  function removeItem(id) {
    dispatchCartAction({type: 'REMOVE_ITEM',id});
  }

  function clearCart() {
    dispatchCartAction({type: "CLEAR_CART"});
  }

  const cartContext = {
    items: cart.items,
    addItem: addItem,
    removeItem,
    clearCart,
  };

//   console.log(cartContext);
  //CartContext is an object of createContext and Provider is a property of this object
  //now any component that needs access to this context can be wrapped in between this property
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
