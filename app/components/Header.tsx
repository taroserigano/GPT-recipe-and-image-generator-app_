// components/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold hover:text-yellow-300 transition duration-300">
            Recipe App🍝
        </Link>
        <Link href="/ai-image" className="text-xl font-semibold hover:text-yellow-300 transition duration-300">
          Image Generation 📸
        </Link>
      </nav>
    </header>
  );
};

export default Header;
