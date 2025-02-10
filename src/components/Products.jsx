import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from './ProductsSlice';
import { ShoppingBag, Plus } from 'lucide-react';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const categories = ['all', ...new Set(products.map(item => item.category))];

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  if (status === 'loading') return <div className="text-center py-10">Loading...</div>;
  if (status === 'failed') return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
        <ShoppingBag className="w-6 h-6" />
      </header>

      <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap capitalize transition-colors ${
              selectedCategory === category 
                ? 'bg-yellow-500 text-black' 
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-zinc-800 rounded-2xl p-4 flex flex-col"
          >
            <div 
              className="aspect-square mb-3 rounded-xl overflow-hidden"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-500">★</span>
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <h3 className="text-white font-medium mb-1">{product.title}</h3>
              <p className="text-gray-400 text-sm truncate mb-2">{product.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-white">${product.price.toFixed(1)}</span>
                <button className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded-xl hover:bg-zinc-600 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;