// 商品情報の型を定義
export type ProductType = keyof typeof Product.productsInfo;

export class Product {
  /**
   * 商品名
   * @var {string}
   */
  public name: string;

  /**
   * 単価
   * @var {number}
   */
  public price: number;

  /**
   * @param {string} code
   */

  // 商品情報をオブジェクトとして定義
  public static productsInfo = {
    grape: { name: "ぶどう", price: 100 },
    apple: { name: "りんご", price: 50 },
    orange: { name: "みかん", price: 70 },
  };

  constructor(public code: ProductType) {
    // コード値に応じた商品情報を格納する
    const product = Product.productsInfo[code];
    if (!product) {
      throw new Error("商品欄に存在しません");
    }
    this.name = product.name;
    this.price = product.price;
  }
}
