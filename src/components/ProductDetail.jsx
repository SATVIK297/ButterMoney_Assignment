import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Plus, Minus, Truck, ShieldCheck } from "lucide-react";
import { incrementQuantity, decrementQuantity, fetchProducts } from "./ProductsSlice";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, quantity, status } = useSelector((state) => state.products);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const product = items.find((p) => p.id === parseInt(id));

  if (status === 'loading') return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  const handleAddToCart = () => {
    toast.success("Feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black z-10 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
      </header>

      {/* Product Image */}
      <div className="aspect-square w-full pt-16">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="bg-black px-4 py-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">{product.title}</h1>
            <p className="text-gray-400">{product.brand}</p>
          </div>
          <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-gray-300 mb-4">{product.description}</p>

        {/* Additional Info */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center text-gray-300">
            <Truck className="w-4 h-4 mr-2" />
            <span className="text-sm">{product.shippingInformation}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span className="text-sm">{product.warrantyInformation}</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex justify-between items-center bg-gray-800 rounded-2xl p-4 mb-4">
          <button
            onClick={() => dispatch(decrementQuantity())}
            className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <Minus className="text-white" size={16} />
          </button>
          <span className="text-lg">{quantity}</span>
          <button
            onClick={() => dispatch(incrementQuantity())}
            className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <Plus className="text-white" size={16} />
          </button>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Total Price</p>
            <p className="text-2xl font-bold">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-8 py-3 rounded-2xl text-black font-semibold transition-colors ${
              product.stock === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-red-500 text-sm">
            Only {product.stock} items left in stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
