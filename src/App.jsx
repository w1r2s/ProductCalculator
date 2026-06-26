import { useState } from 'react'
import './App.css'
import { ProductPanel } from './components/ProductPanel.jsx';

function createEmptyProduct() {
  return {
    id: crypto.randomUUID(),
    name: "",
    quantity: "",
    price: "",
  };
}

function isValidDecimalInput(value, allowedDecimalCount) {
  const parts = value.split(".");

  if (parts.length > 2) {
    return false;
  }

  for (const char of value) {
    const isDigit = char >= "0" && char <= "9";
    const isDot = char === ".";

    if (!isDigit && !isDot) {
      return false;
    }
  }

  const decimalPart = parts[1] ?? "";

  return decimalPart.length <= allowedDecimalCount;
}

function App() {
  const [products, setProducts] = useState([createEmptyProduct()]);
  const [focusedProductId, setFocusedProductId] = useState(null);
  const [total, setTotal] = useState(0);
  const [calculationError, setCalculationError] = useState("");


  function handleChangeProduct(productId, field, value) {
    let nextValue = value;

    if (field === "quantity" || field === "price") {
      nextValue = value.replace(",", ".");
      const decimalCount = field === "quantity" ? 5 : 2;

      if (!isValidDecimalInput(nextValue, decimalCount)) {
        return;
      }
    }

    setProducts((currentProducts) => {
      return currentProducts.map((product) => product.id === productId ? { ...product, [field]: nextValue } : product);
    });
  }

  function handleAddProduct(productId) {
    const currentIndex = products.findIndex((product) => product.id === productId);

    if (currentIndex === -1) {
      return;
    }

    const newProduct = createEmptyProduct();

    const newProducts = [...products.slice(0, currentIndex + 1), newProduct, ...products.slice(currentIndex + 1)];

    setProducts(newProducts);
    setFocusedProductId(newProduct.id);
  }

  function handleDeleteProduct(productId) {
    setProducts((currentProducts) => {
      if (currentProducts.length <= 1) {
        return currentProducts;
      }
      return currentProducts.filter((product) => product.id !== productId)
    })
  }

  function handleCalculate() {
    let result = 0;

    for (const product of products) {
      const name = product.name.trim();
      const quantity = Number(product.quantity);
      const price = Number(product.price);

      if (name === "" || product.quantity === "" || product.price === "") {
        setCalculationError("Заполните все поля перед расчетом.");
        return;
      }

      if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price <= 0) {
        setCalculationError("Количество и цена должны быть положительными числами.");
        return;
      }

      result += quantity * price;
    }

    setCalculationError("");
    setTotal(result);
  }

  return (
    <main className="app">
      <h1 className="app-title">Список продуктов</h1>
      <div className="product-list">
        {products.map((product) => {
          return <ProductPanel
            key={product.id}
            product={product}
            onChange={handleChangeProduct}
            onAdd={handleAddProduct}
            onDelete={handleDeleteProduct}
            isDeleteDisabled={products.length <= 1}
            shouldFocus={product.id === focusedProductId}
          />
        })}
      </div>
      <div className="summary">
        <button type="button" onClick={handleCalculate}>Рассчитать сумму</button>
        <div className="summary-output">
          <p className="summary-total">Общая сумма: {total.toFixed(2)} ₽</p>
          {calculationError !== "" && <p className="summary-error">{calculationError}</p>}
        </div>
      </div>
    </main>
  );
}

export default App
