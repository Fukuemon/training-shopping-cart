import { Product, ProductType } from "./product";

export type Stock = {
  product: Product;
  count: number;
};

export type Order = { count: number; total: number };

export class ShoppingCart {
  /**
   * カートに入った商品情報
   * @readonly
   * @var {{[key: string]: Stock}}
   */
  public readonly products: {
    [key: string]: Stock;
  } = {};

  /**
   * カートに商品を追加する
   * @param {ProductType} code
   * @param {number} count
   * @returns {number} 追加後の個数を返却する
   */
  public add(code: ProductType, count: number): number {
    // 早期returnを使い、if文を減らす

    // すでにproductが存在する場合
    if (code in this.products) {
      this.products[code].count += count;
      return this.products[code].count;
    }

    // 新規追加の場合
      this.products[code] = {
        product: new Product(code),
        count,
      };

    return this.products[code].count;

    // 改善前
    // if (code in this.products) {
    //   this.products[code].count += count;
    // } else {
    //   this.products[code] = {
    //     product: new Product(code),
    //     count,
    //   };
    // }
    // return this.products[code].count;
  }

  /**
   * カートから商品を取り出す
   * @param code
   * @param count
   * @returns {number} 削除後の個数を返却する
   */
  public remove(code: ProductType, count: number = 1): number {
    // 早期returnを使い、if文を減らす

    // productが存在しない場合
    if (!(code in this.products)) {
      return 0;
    }

    // productが存在する場合
      this.products[code].count -= count;

      // 個数が0になったら削除する
      if (this.products[code].count === 0) {
        delete this.products[code];
      return 0;
    }

    return this.products[code].count;

    // 改善前
    // if (code in this.products) {
    //   this.products[code].count -= count;
    //   // 個数が0になったら削除する
    //   if (this.products[code].count === 0) {
    //     delete this.products[code];
    //     return 0;
    //   } else {
    //     return this.products[code].count;
    //   }
    // } else {
    //   return 0;
    // }
  }

  /**
   * 注文する
   * @returns {Order} 商品点数と合計金額を返却する
   */

  public order(): Order {
    if (Object.keys(this.products).length === 0) {
      throw new Error("カートが空なので注文できません");
    }

    return this.calcOrder();

    /* 商品点数と合計金額の計算は別の関数に切り出す
    const order = { count: 0, total: 0 };
    for (const { count, product } of Object.values(this.products)) {
      order.count += count;
      order.total += product.price * count;
    }
    return order;
    */
  }

  // 商品点数と合計金額の計算
  private calcOrder(): Order {
    const order = { count: 0, total: 0 };
    for (const { count, product } of Object.values(this.products)) {
      order.count += count;
      order.total += product.price * count;
    }
    return order;
  }
}
