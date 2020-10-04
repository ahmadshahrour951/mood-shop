import data from './data.js';

const itemsContainer = document.getElementById('items');
const itemList = document.getElementById('item-list');
const cartQty = document.getElementById('cart-qty');
const cartTotal = document.getElementById('cart-total');

// the length of our data determines how many times this loop goes around
data.forEach((mood) => {
  // create a new div element and give it a class name
  let newDiv = document.createElement('div');
  newDiv.className = 'item';

  // create an image element
  let img = document.createElement('img');
  // this will change each time we go through the loop. Can you explain why?
  img.src = mood.image;
  img.width = 300;
  img.height = 300;

  let p_desc = document.createElement('P');
  p_desc.innerText = mood.desc;

  let p_price = document.createElement('P');
  p_price.innerText = mood.price;

  let button = document.createElement('button');
  button.id = mood.name;
  button.dataset.price = mood.price;
  button.innerHTML = 'Add to Cart';

  // Add the image to the div
  newDiv.appendChild(img);
  newDiv.appendChild(p_desc);
  newDiv.appendChild(p_price);
  newDiv.appendChild(button);

  itemsContainer.appendChild(newDiv);
});

const cart = [];

function getQty() {
  let qty = 0;
  for (let i = 0; i < cart.length; i++) {
    qty += cart[i].qty;
  }
  return qty;
}

function getTotal() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }
  return total.toFixed(2);
}

function showItems() {
  cartQty.innerHTML = `You have ${getQty()} items in your cart`;

  let itemStr = '';
  for (let i = 0; i < cart.length; i++) {
    const { name, price, qty } = cart[i];

    itemStr += `<li>
    ${name} $${price} x ${qty} = 
    $${price * qty} 
    <button class="remove" data-name="${name}">Remove</button>
    <button class="add-one" data-name="${name}"> + </button>
    <button class="remove-one" data-name="${name}"> - </button>
    <input class="update" type="number" data-name="${name}">
    </li>`;
  }
  itemList.innerHTML = itemStr;

  cartTotal.innerHTML = `Total in cart: $${getTotal()}`;
}

function addItem(name, price) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty++;
      showItems();
      return;
    }
  }
  const item = { name, price, qty: 1 };
  cart.push(item);
  showItems();
}

function removeItem(name, qty = 0) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      if (qty > 0) {
        cart[i].qty -= qty;
      }

      if (cart[i].qty < 1 || qty === 0) {
        cart.splice(i, 1);
      }

      showItems();
      return;
    }
  }
}

function updateCart(name, qty = 0) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      if (qty < 1) {
        removeItem(name);
        return;
      }
      cart[i].qty = qty;
      showItems();
      return;
    }
  }
}

const all_items_button = Array.from(document.querySelectorAll('button'));
all_items_button.forEach((elt) =>
  elt.addEventListener('click', () => {
    addItem(elt.getAttribute('id'), elt.getAttribute('data-price'));
    showItems();
  })
);

itemList.onchange = function (e) {
  if (e.target && e.target.classList.contains('update')) {
    const name = e.target.dataset.name;
    const qty = parseInt(e.target.value);

    updateCart(name, qty);
  }
};

itemList.onclick = function (e) {
  if (e.target && e.target.classList.contains('remove')) {
    const name = e.target.dataset.name;
    removeItem(name);
  } else if (e.target && e.target.classList.contains('add-one')) {
    const name = e.target.dataset.name;
    addItem(name);
  } else if (e.target && e.target.classList.contains('remove-one')) {
    const name = e.target.dataset.name;
    removeItem(name, 1);
  }
};
