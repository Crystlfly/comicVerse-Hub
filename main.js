function getComics(){
  return window.COMICS || [];
}

function qParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

const CART_KEY = 'comicverse_cart';
function getCart(){
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e){
    console.error('cart read error',e);
    return {};
  }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(id, qty=1){
  const comics = getComics();
  const item = comics.find(c => c.id === id);
  if(!item) return {error:'not found'};
  const cart = getCart();
  if(cart[id]) cart[id].qty += qty;
  else cart[id] = {id: item.id, title: item.title, price: item.price, image: item.image, qty};
  saveCart(cart);
  return {success:true, cart};
}
function updateQty(id, qty){
  const cart = getCart();
  if(!cart[id]) return;
  if(qty <= 0) { delete cart[id]; }
  else cart[id].qty = qty;
  saveCart(cart);
  return cart;
}
function removeFromCart(id){
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  return cart;
}
function cartItemsArray(){
  const cart = getCart();
  return Object.values(cart);
}
function cartTotal(){
  return cartItemsArray().reduce((s,i) => s + i.price * i.qty, 0);
}

function currency(n){ return n.toLocaleString('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:2}) }

function flashToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style,{position:'fixed',right:'16px',bottom:'20px',background:'#0f1724',padding:'8px 12px',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,0.6)',zIndex:9999});
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity='0.01',2000);
  setTimeout(()=> t.remove(),2600);
}
