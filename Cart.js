class CartItemO {
  constructor(name, category, price, quantity = 1, discount = 0) {
    this.name = name;
    this.category = category;
    this.price = price;
    this.quantity = quantity;
    this.discount = discount;
    this.uuid = Number(Math.random().toString().slice(2, 10));
  }

  setCartItemCategory(category) {
    this.category = category;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  setDiscount(discount) {
    this.discount = discount;
    return this;
  }
  // Ma miec: Nazwę, Kategorię, Cenę, Rabat % na przedmiot, uuid
  // Ma umożliwiać:
  // - określać jego rabat procentowy
  // - dodawać produkt do kategorii
  // - zmianę nazwy, ceny lub rabatu
}

const apple = new CartItem("apple", "food", 2, 4);
const berry = new CartItem("berry", "food", 12, 5);

class CartO {
  constructor() {
    this.uuid = Number(Math.random().toString().slice(2, 10));
    this.cart = [];
    this.total = 0;
    this.discountCoupones = ["weekend-5", "weekend-10", "weekend-15"];
  }

  addItem(cartItem) {
    this.cart.push(cartItem);
    // sumowanie ilosci oraz ceny
    return this;
  }
  removeItem(cartItemId) {
    this.cart = this.cart.filter((product) => product.id !== cartItemId);
    this.sumPrices();
    return this;
  }
  changeItemQty(cartItemId, quantity) {
    const selectedItem = this.cart.filter((product) => {
      console.log(product.uuid);
      return product.uuid === cartItemId;
    })[0];
    console.log(selectedItem);
    selectedItem.quantity = quantity;
    this.sumPrices();
    return this;
  }
  discountCart(coupon) {
    if (this.discountCoupones.includes(coupon)) {
      const discount = parseInt(coupon.replace(/[^0-9]/g, ""));
      this.total = this.total - (this.total * discount) / 100;
      console.log(this.total);
      return this;
    }
    return new Error("Name of coupon is wrong");
  }
  sumPrices() {
    const calculateTotalPrice = this.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    this.total = calculateTotalPrice;
    return this;
  }
  // Ma mieć: uuid, listę wybranych przedmiotów, rabat % na koszyk, kod rabatowy
  // Ma umożliwiać:
  // - dodawanie/usuwanie przedmiotów do/z koszyka
  // - zmianę ilości produktu w koszyku
  // - podliczać wartość koszyka uwzględniajac rabaty
}

const cart = new Cart();
cart.addItem(apple);
cart.addItem(berry);
cart.addItem(berry);
