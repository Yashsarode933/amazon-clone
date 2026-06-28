import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-amazon-dark text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-amazon-orange transition">
          <span className="text-amazon-orange">amazon</span>
          <span className="text-white">.clone</span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-black rounded-l-md focus:outline-none"
            />
            <button className="px-4 py-2 bg-amazon-orange hover:bg-orange-600 rounded-r-md transition">
              🔍
            </button>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex items-center space-x-4 text-sm">
          <Link to="/signin" className="hover:underline">
            <div>Hello, Sign in</div>
            <div className="font-bold">Account & Lists</div>
          </Link>
          <Link to="/orders" className="hover:underline">
            <div>Returns</div>
            <div className="font-bold">& Orders</div>
          </Link>
          <Link to="/wishlist" className="hover:underline">
            <div>❤️ Wishlist</div>
          </Link>
          <Link to="/cart" className="flex items-center hover:underline">
            <span className="text-2xl mr-1">🛒</span>
            <div>
              <div>Cart</div>
            </div>
          </Link>
          <Link to="/admin" className="hover:underline text-xs bg-amazon-orange px-2 py-1 rounded">
            Admin
          </Link>
        </nav>
      </div>

      {/* Category navigation */}
      <nav className="bg-amazon-light px-4 py-1 text-sm">
        <div className="flex space-x-4 overflow-x-auto">
          <Link to="/category/electronics" className="hover:underline whitespace-nowrap">Electronics</Link>
          <Link to="/category/clothing" className="hover:underline whitespace-nowrap">Clothing</Link>
          <Link to="/category/home-kitchen" className="hover:underline whitespace-nowrap">Home & Kitchen</Link>
          <Link to="/category/books" className="hover:underline whitespace-nowrap">Books</Link>
          <Link to="/category/sports-outdoors" className="hover:underline whitespace-nowrap">Sports & Outdoors</Link>
          <Link to="/category/beauty" className="hover:underline whitespace-nowrap">Beauty</Link>
          <Link to="/category/toys-games" className="hover:underline whitespace-nowrap">Toys & Games</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
