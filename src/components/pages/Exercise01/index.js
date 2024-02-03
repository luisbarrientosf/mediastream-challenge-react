/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import './assets/styles.css'
import { useMemo, useState } from 'react'

export default function Exercise01 () {
  const movies = [
    {
      id: 1,
      name: 'Star Wars',
      price: 20
    },
    {
      id: 2,
      name: 'Minions',
      price: 25
    },
    {
      id: 3,
      name: 'Fast and Furious',
      price: 10
    },
    {
      id: 4,
      name: 'The Lord of the Rings',
      price: 5
    }
  ]



  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Star Wars',
      price: 20,
      quantity: 2
    }
  ])


  const getTotalDiscounts = useMemo(() => {
    const discountRules = [
      { m: [3, 2], discount: 0.25 },
      { m: [2, 4, 1], discount: 0.5 },
      { m: [4, 2], discount: 0.1 } 
    ];
    // I'll consider that the discounts can only be applied one time per cart.
    // Ex: if you have m1: [1,2,3] and m2: [1,2]
    // - If in cart you have [1,2] only m2 will be applied.
    // - If in cart you have [1,2,3] only m1 will be applied.
    // - If in cart you have [1,1,2,2,3] both will be applied.
    
    // Discounts will be applied from max discount to min discount.
    let total = 0;
    const discountCart = JSON.parse(JSON.stringify(cart));
    const discounts = discountRules.sort((a, b) => b.discount - a.discount);

    discounts.forEach(disc => {
      let canApply = true;
      disc.m.forEach(m => {
        const find = discountCart.find(product => product.id === m);
        if(!find){
          canApply = false;
        } else if (find.quantity === 0) {
          canApply = false;
        }
      });
      if(canApply){
        disc.m.forEach(m => {
          const find = discountCart.find(product => product.id === m);
          find.quantity = find.quantity - 1;
        });
        total += disc.discount;
      }
    });

    return total;
  }, [cart]);

  const getTotal = useMemo(() => {
    const total = cart.reduce((prev, item) => prev + item.price * item.quantity, 0);
    
    return total - getTotalDiscounts;
  }, [cart, getTotalDiscounts]);



  const addToCart = (product) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      const findProduct = newCart.find(p => p.id === product.id);
      if(findProduct){
        const index = newCart.findIndex(p => p.id === product.id);
        const newProduct = {
          ...findProduct,
          quantity: findProduct.quantity + 1
        }
        newCart.splice(index, 1, newProduct);
      } else {
        const newProduct = {
          ...product,
          quantity: 1
        }
        newCart.push(newProduct)
      }
      return newCart;
    });
  }

  const decreaseFromCart = (product) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      const findProduct = newCart.find(p => p.id === product.id);
      if(findProduct){
        const index = newCart.findIndex(p => p.id === product.id);
        if(findProduct.quantity > 1){
          const newProduct = {
            ...findProduct,
            quantity: findProduct.quantity - 1
          }
          newCart.splice(index, 1, newProduct);
        } else {
          newCart.splice(index, 1);
        }
      } 
      return newCart;
    });
  }

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map(o => (
            <li className="movies__list-card">
              <ul>
                <li>
                  ID: {o.id}
                </li>
                <li>
                  Name: {o.name}
                </li>
                <li>
                  Price: ${o.price}
                </li>
              </ul>
              <button onClick={() => addToCart(o)}>
                Add to cart
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="movies__cart">
        <ul>
          {cart.map(x => (
            <li className="movies__cart-card">
              <ul>
                <li>
                  ID: {x.id}
                </li>
                <li>
                  Name: {x.name}
                </li>
                <li>
                  Price: ${x.price}
                </li>
              </ul>
              <div className="movies__cart-card-quantity">
                <button onClick={() => decreaseFromCart(x)}>
                  -
                </button>
                <span>
                  {x.quantity}
                </span>
                <button onClick={() => addToCart(x)}>
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="movies__cart-total">
          
          <p>Total: ${getTotal}</p>
          <br />
          <p>Discounts: $-{getTotalDiscounts}</p>
        </div>
      </div>
    </section>
  )
} 