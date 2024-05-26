// components/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg">
      <nav className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
          <Link href="/" className="text-2xl font-extrabold hover:text-yellow-300 transition duration-300">
            Recipe App🍝
          </Link>
        </div>
        <div className="w-full sm:w-auto text-center sm:text-right">
          <Link href="/ai-image" className="text-xl font-semibold hover:text-yellow-300 transition duration-300">
            Image Generation 📸
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
