# 改善点
### 1. switch文を使わず、商品情報をオブジェクトで管理
オブジェクトで情報を管理しておくことで、switch文を省略でき、新規追加の際に変更が用意になる
また、keyofとtypeof演算子を使い、オブジェクトから型を作成することで、型安全にできる
- 変更前
```ts
export class Product {

  constructor(public code: string) {
    // コード値に応じた商品情報を格納する
    switch (code) {
      case "grape":
        this.name = "ぶどう";
        this.price = 100;
        break;
      case "apple":
        this.name = "りんご";
        this.price = 50;
        break;
      case "orange":
        this.name = "みかん";
        this.price = 70;
        break;
      default:
        throw new Error("codeが不正な値です");
    }
  }
}
```

- 変更後
```ts
// 商品情報の型を定義
export type ProductType = keyof typeof Product.productsInfo;

export class Product {
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

```

### 2.早期returnを使い、if文のネストを減らす
状態を把握して、早期にreturn文で処理を終わらせることができないかを考える

### add関数
- 変更前
```ts
public add(code: ProductType, count: number = 1): number {
  if (code in this.products) {
    this.products[code].count += count;
  } else {
    this.products[code] = {
      product: new Product(code),
      count,
    };
  }
  return this.products[code].count;
}
```

- 変更後
```ts
public add(code: ProductType, count: number = 1): number {
  if (code in this.products) {
    this.products[code].count += count;
    return this.products[code].count;
  }

  this.products[code] = {
    product: new Product(code),
    count,
  };

  return this.products[code].count;
}
```

### remove関数
- 変更前
```ts
public remove(code: ProductType, count: number = 1): number {
  if (code in this.products) {
    this.products[code].count -= count;
  
  // 個数が0になったら削除する
  if (this.products[code].count === 0) {
    delete this.products[code];
    return 0;
    } else {
      return this.products[code].count;
    }
  } else {
    return 0;
  }
}
```

- 変更後
```ts
public remove(code: ProductType, count: number = 1): number {
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
}
```

### 3. 商品点数と合計金額の計算を別の関数で切り出す

- 変更前
```ts
public order(): Order {
  if (Object.keys(this.products).length === 0) {
    throw new Error("カートが空なので注文できません");
  }

  const order = { count: 0, total: 0 };
  for (const { count, product } of Object.values(this.products)) {
    order.count += count;
    order.total += product.price * count;
  }
  return order;
}

```
```ts
public order(): Order {
  if (Object.keys(this.products).length === 0) {
    throw new Error("カートが空なので注文できません");
  }

  return this.calcOrder();
}

// 商品点数と合計金額の計算
private calcOrder(): Order {
  const order = { count: 0, total: 0 };
  for (const { count, product } of Object.values(this.products)) {
    order.count += count;
  }
}
```

### Q：add関数とremove関数にdefault値で1を代入するべきか
- A1：add関数を呼びだす際は必ず1個以上は追加するはずので、デフォルト値を1にする？
- A2：間違えて呼び出してしまった場合に追加されてしまうため、デフォルト値は0にするべき？
    デフォルト値を設定しない場合は、バリデーションを行う必要がある

今回はA2を採用

### 4.add関数とremove関数で引数が1以上になるようにバリデーションを行う
1. 型ガード関数を作成
```ts
type PositiveNumber = number;
// 正の数のみを受け取る型を定義する型ガード関数
function isPositiveNumber(value: number): value is PositiveNumber {
  return value > 0;
}
```
2. add関数とremove関すでバリデーションを追加
```ts
public add(code: ProductType, count: number): number {
  if (!isPositiveNumber(count)) {
    throw new Error("1つ以上の商品を選択してください");
  }
...(add関数も同様に)
}

```
