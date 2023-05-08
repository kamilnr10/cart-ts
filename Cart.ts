interface ICartItem {
    _name: string;
    _category: string;
    _price: number;
    _quantity: number;
    _discount?: string;
    _uuid: number;
    setCartItemCategory: (category: string) => CartItem;
    setName: (name: string) => CartItem;
    setPrice: (price: number) => CartItem;
    setDiscount: (discount: string) => CartItem;
  }
  
  class CartItem implements ICartItem {
    _name: string;
    _category: string;
    _price: number;
    _quantity: number;
    _discount: string;
    _uuid: number;
  
    constructor(
      name: string,
      category: string,
      price: number,
      quantity: number = 1,
      discount: string = ''
    ) {
      this._name = name;
      this._category = category;
      this._price = discount ? price - (price * Number(discount.replace('%', ''))) / 100 : price;
      this._quantity = quantity;
      this._discount = discount;
      this._uuid = Number(Math.random().toString().slice(2, 10));
    }
  
    public setCartItemCategory(category: string): CartItem {
      this._category = category;
      return this;
    }
  
    public setName(name: string): CartItem {
      this._name = name;
      return this;
    }
  
    public setPrice(price: number): CartItem {
      this._price = price;
      return this;
    }
  
    public setDiscount(discount: string): CartItem {
        if(!discount.includes('%') && discount.length === 3) throw new Error('Discount should include number and % ex. 20%')
      this._discount = discount;
      return this;
    }
     // Ma miec: Nazwę, Kategorię, Cenę, Rabat % na przedmiot, uuid
    // Ma umożliwiać: 
    // - określać jego rabat procentowy
    // - dodawać produkt do kategorii
    // - zmianę nazwy, ceny lub rabatu
  }
  

  
  const test: CartItem = new CartItem("apple", "food", 2, 4);
//   const berry: CartItemm = new CartItem("berry", "food", 12, 5, 10);
  
interface ICart {
    uuid: number;
    cart: object[];
    total: number;
    discountCoupones: string[];
    addItem: (cartItem: Item) => Cart;
    removeItem: (cartItemId: number) => Cart;
    changeItemQty: (cartItemId: number, quantity: number) => Cart;
    discountCart: (coupon: string) => Cart | Error;
    sumPrices: () => Cart

  }

  type Item = {
    _name: string;
    _category: string;
    _price: number;
    _quantity: number;
    _discount?: string;
    _uuid: number;
  }

  class Cart implements ICart {
    uuid: number;
    cart: Item[];
    total: number;
    discountCoupones: string[];

    constructor() {
      this.uuid = Number(Math.random().toString().slice(2, 10));
      this.cart = [];
      this.total = 0;
      this.discountCoupones = ["weekend-5", "weekend-10", "weekend-15"];
    }
  
    public addItem(cartItem: Item): Cart {
      this.cart.push(cartItem);
      this.sumPrices();
      // sumowanie ilosci oraz ceny
      return this;
    }

    public removeItem(cartItemId: number): Cart {
      this.cart = this.cart.filter((product) => product._uuid !== cartItemId);
      this.sumPrices();
      return this;
    }

    public changeItemQty(cartItemId: number, quantity: number): Cart {
      const selectedItem = this.cart.filter(
        (product) => product._uuid === cartItemId
      )[0];
      selectedItem._quantity = quantity;
      this.sumPrices()
      return this;
    }

    public discountCart(coupon: string): Cart | Error {
      if (this.discountCoupones.includes(coupon)) {
        const discount = parseInt(coupon.replace(/[^0-9]/g, ""));
        this.total = this.total - (this.total * discount) / 100;
        console.log(this.total);
        return this;
      }
      return new Error("Name of coupon is wrong");
    }
    public sumPrices(): Cart {
      const calculateTotalPrice = this.cart.reduce((total, item) => {
        return total + item._price * item._quantity;
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

  