const Footer = () => {
  return (
    <footer className="bg-amazon-dark text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-3 text-amazon-orange">Get to Know Us</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">About Amazon</a></li>
              <li><a href="#" className="hover:underline">Investor Relations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-amazon-orange">Make Money with Us</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Sell products</a></li>
              <li><a href="#" className="hover:underline">Sell apps</a></li>
              <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-amazon-orange">Amazon Payment Products</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Amazon Rewards</a></li>
              <li><a href="#" className="hover:underline">Amazon Credit Cards</a></li>
              <li><a href="#" className="hover:underline">Amazon Pay</a></li>
              <li><a href="#" className="hover:underline">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-amazon-orange">Let Us Help You</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Your Orders</a></li>
              <li><a href="#" className="hover:underline">Shipping Rates & Policies</a></li>
              <li><a href="#" className="hover:underline">Returns & Replacements</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-6 pt-4 text-center text-gray-400 text-xs">
          © 2024 Amazon Clone. This is a portfolio project - not affiliated with Amazon.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
