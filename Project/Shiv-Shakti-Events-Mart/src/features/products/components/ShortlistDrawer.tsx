import { X, Heart } from 'lucide-react';
import type { Product } from '../../../shared/types/models.types';

export interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlist: string[];
  products: Product[];
  onToggleShortlist: (id: string, name: string) => void;
}

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlist,
  products,
  onToggleShortlist,
}: ShortlistDrawerProps) {
  const favoriteProducts = products.filter((item) => shortlist.includes(item.id));

  return (
    <>
      <div className={`shortlist-modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-header">
          <h2>My Saved Favorites ({shortlist.length})</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close favorites">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="shortlist-items">
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map((item) => (
                <div key={item.id} className="item">
                  <div className="item-image">
                    <img
                      src={item.image || (item.images && item.images[0]?.url)}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => onToggleShortlist(item.id, item.name)}
                    className="remove-btn"
                    aria-label={`Remove ${item.name} from favorites`}
                  >
                    <X className="icon" />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">
                <Heart className="icon" />
                <p>You haven't shortlisted any luxury concepts yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && <div className="modal-overlay" onClick={onClose} />}
    </>
  );
}
