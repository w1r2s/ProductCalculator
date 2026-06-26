import { useEffect, useRef } from "react";

export function ProductPanel({ product, onChange, onAdd, onDelete, isDeleteDisabled, shouldFocus }) {
    const nameRef = useRef(null);

    useEffect(() => {
        if (shouldFocus) {
            nameRef.current?.focus();
        }
    }, [shouldFocus]);

    return (
        <section className="product-panel">
            <input ref={nameRef} value={product.name} onChange={(e) => onChange(product.id, "name", e.target.value)} placeholder="Наименование" />
            <input value={product.quantity} inputMode="decimal" onChange={(e) => onChange(product.id, "quantity", e.target.value)} placeholder="Количество" />
            <input value={product.price} inputMode="decimal" onChange={(e) => onChange(product.id, "price", e.target.value)} placeholder="Цена" />
            <button className="add-button" type="button" onClick={() => onAdd(product.id)}>+</button>
            <button className="delete-button" type="button" onClick={() => onDelete(product.id)} disabled={isDeleteDisabled} >-</button>
        </section>
    );
}