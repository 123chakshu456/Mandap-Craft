import { X } from 'lucide-react';

export interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating?: number;
    reviews?: number;
    description: string;
    features?: string[];
  } | null;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (product: any) => void;
  onDecrementCart: (id: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  cartQuantity,
  onAddToCart,
  onDecrementCart,
}: ProductDetailModalProps) {
  if (!product) return null;

  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="product-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn" aria-label="Close modal">
          <X className="icon" />
        </button>
        <div className="product-grid">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-details">
            <div>
              <h1>{product.name}</h1>
              <div className="rating">
                <span className="stars" style={{ color: '#f59e0b' }}>
                  ★
                </span>
                <span className="count">
                  {' '}
                  {product.rating || 4.9} ({product.reviews || 12} Reviews)
                </span>
              </div>
            </div>
            <p className="description">{product.description}</p>
            {features.length > 0 && (
              <div className="features">
                <h3>Key Specifications</h3>
                <ul>
                  {features.map((feat: string, idx: number) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="footer">
              <div className="price">
                <span className="label">Package starts</span>
                <span className="value">₹{product.price.toLocaleString()}</span>
              </div>
              {cartQuantity > 0 ? (
                <div className="modal-qty-control">
                  <button
                    type="button"
                    onClick={() => onDecrementCart(product.id)}
                    className="qty-btn minus"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="qty-value">
                    {cartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="qty-btn plus"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button onClick={() => onAddToCart(product)} className="add-btn">
                  Book / Add to Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
