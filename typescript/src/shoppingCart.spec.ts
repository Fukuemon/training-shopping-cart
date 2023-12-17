import { ProductType } from "./product";
import { Order, ShoppingCart } from "./shoppingCart";

describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe.each([
    ["apple" as ProductType, 2, 1, 1],
    ["orange" as ProductType, 3, 3, 0],
    ["grape" as ProductType, 10, 5, 5],
  ])(
    "add & remove",
    (fruit: ProductType, add: number, remove: number, expected: number) => {
      const vFruit = fruit.padStart(6, " ");
      const vAdd = String(add).padStart(2, " ");
      const vRemove = String(remove).padStart(2, " ");

      it(`fruit: ${vFruit}, add: ${vAdd}, remove: ${vRemove}`, () => {
        expect(cart.add(fruit, add)).toBe(add);
        expect(cart.remove(fruit, remove)).toBe(expected);
      });
    }
  );

  describe.each<[[ProductType, number][], Order]>([
    [
      [
        ["apple", 3], // 150
        ["apple", 3], // 150
        ["apple", 3], // 150
      ],
      { count: 9, total: 450 },
    ],
    [
      [
        ["apple", 20], // 1,000
        ["grape", 4], // 400
        ["orange", 8], // 560
      ],
      { count: 32, total: 1960 },
    ],
    [
      [
        ["grape", 3], // 300
        ["orange", 9], // 630
      ],
      { count: 12, total: 930 },
    ],
  ])("order", (products: [ProductType, number][], expected: Order) => {
    it(`products: ${JSON.stringify(products)}`, () => {
      for (const [fruit, count] of products) {
        cart.add(fruit, count);
      }
      expect(cart.order()).toMatchObject(expected);
    });
  });
});
