interface ICartItem {
  readonly uuid: number;
  setCartItemCategory: (category: string) => void;
  setName: (name: string) => void;
  setPrice: (price: number) => void;
  setDiscount: (discount: string) => void;
  setQuantity: (quantity:number) => void;
}

// hermetyzacja
class CartItem implements ICartItem {
  private name: string;
  private category: string;
  private price: number;
  private quantity: number;
  private discount: string;
  private errors: {
    name: string;
    category: string;
    quantity: string
  };
  readonly uuid: number;

  constructor(
    name: string,
    category: string,
    price: number,
    quantity: number = 1,
    discount: string = ""
  ) {
    this.name = name;
    this.category = category;
    this.price = discount
      ? price - (price * Number(discount.replace("%", ""))) / 100
      : price;
    this.quantity = quantity;
    this.discount = discount;
    this.errors = {name: '', category: '', quantity: ''};
    this.uuid = Number(Math.random().toString().slice(2, 10));
  }

  public isValid() {
    this.errors = {name: '', category: '', quantity: ''};

    if(this.name.length < 3) {
      this.errors.name = 'Name should be at least 3 characters length'
    }
    if(this.category.length < 3) {
      this.errors.category = 'Category should be at least 3 characters length'
    }
    if(this.quantity >= 0 || this.quantity <= 100) {
      this.errors.quantity = 'Quantity must me in range 1 - 100'
    }
    const hasEmptyValues = Object.values(this.errors).every(value => value === '' || value === null || value === undefined);
    if (!hasEmptyValues) {
      // jak wyrzucić error dla konkretnej wlasciwosci ? if(Object.values(this.errors).some(value => value.length > 0))
      throw new Error('Invalid cart item. Please check provided values');
    }
  }


  public setCartItemCategory(category: string): void {
    this.isValid();
    this.category = category;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public setDiscount(discount: string): void {
    if (!discount.includes("%") && discount.length === 3)
      throw new Error("Discount should include number and % ex. 20%");
    this.discount = discount;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  } 
  // Ma miec: Nazwę, Kategorię, Cenę, Rabat % na przedmiot, uuid
  // Ma umożliwiać:
  // - określać jego rabat procentowy
  // - dodawać produkt do kategorii
  // - zmianę nazwy, ceny lub rabatu
}

// yagni - you arent gonna need it,
// dry - dont repeat yourself,
// kiss - keep it simple, stupid

const test: CartItem = new CartItem("apple", "food", 2, 4);
//   const berry: CartItemm = new CartItem("berry", "food", 12, 5, 10);

interface ICart {
  uuid: number;
  cart: object[];
  total: number;
  discountCoupones: string[];
  addItem: (cartItem: Item) => void;
  removeItem: (cartItemId: number) => void;
  changeItemQty: (cartItemId: number, quantity: number) => void;
  discountCart: (coupon: string) => void;
  sumPrices: () => number;
}

type Item = {
  name: string;
  category: string;
  price: number;
  quantity: number;
  discount?: string;
  uuid: number;
  setQuantity: (quantity: number) => void;
  isValid: () => void;
};

// observer pattern



class Cart implements ICart {
  uuid: number;
  cart: Item[];
  total: number;
  discountCoupones: string[];


  constructor() {
    this.uuid = Number(Math.random().toString().slice(2, 10));
    this.cart = [];
    this.total = 0;
    // singleton
    // separation of consens / 'S'olid
    this.discountCoupones = ["weekend-5", "weekend-10", "weekend-15"];
  }



  // optimistic update
  public addItem(cartItem: Item): void {
    this.cart.push(cartItem);
    this.updateTotal();
  }

  public removeItem(cartItemId: number): void {
    // X find index + splice
    const itemIndex = this.cart.findIndex((product) => product.uuid === cartItemId);
    if (itemIndex !== -1) {
      this.cart.splice(itemIndex, 1);
      this.updateTotal();
    }
  }

  public changeItemQty(cartItemId: number, quantity: number): void {
    // X find 
    const selectedItem = this.cart.find((product) => product.uuid === cartItemId);
    // walidacja
    selectedItem?.isValid();
    selectedItem?.setQuantity(quantity);
    this.updateTotal();
  }

  public discountCart(coupon: string): Cart {
    if (this.discountCoupones.includes(coupon)) {
      const discount = parseInt(coupon.replace(/[^0-9]/g, ""));
      this.total = this.total - (this.total * discount) / 100;
      console.log(this.total);
    }
    throw new Error("Name of coupon is wrong");
  }

  public sumPrices(): number {
    return this.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  private updateTotal(): void {
    this.total = this.sumPrices();
  }

  // Ma mieć: uuid, listę wybranych przedmiotów, rabat % na koszyk, kod rabatowy
  // Ma umożliwiać:
  // - dodawanie/usuwanie przedmiotów do/z koszyka
  // - zmianę ilości produktu w koszyku
  // - podliczać wartość koszyka uwzględniajac rabaty
}
