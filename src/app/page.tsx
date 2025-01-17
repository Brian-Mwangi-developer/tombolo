'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from './header';
import { FaTelegram, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-yellow-200 flex flex-col">
      <Header />

      {/* Main Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center mt-32 space-y-6 md:mt-28">
        {/* Logo */}
        <img
          src="/LOGO.png"
          alt="FinestTraders Platform Logo"
          className="h-52 w-52 rounded-full border-4 border-yellow-500 shadow-lg"
        />

        {/* Login and Signup Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <Link
              href="https://track.deriv.com/_NJuBnajFLo5Zl7VyVw174GNd7ZgqdRLk/1/"
              className="bg-yellow-600 px-6 py-2 rounded-full text-white font-semibold text-lg shadow-lg hover:bg-yellow-700 transition"
            >
              Login
            </Link>
            <Link
              href="https://track.deriv.com/_NJuBnajFLo5Zl7VyVw174GNd7ZgqdRLk/1/"
              className="bg-blue-800 px-6 py-2 rounded-full text-white font-semibold text-lg shadow-lg hover:bg-blue-900 transition"
            >
              Signup
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6 mt-4">
            <a
              href="https://t.me/FinestTraders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-400 transition"
            >
              <FaTelegram size={32} />
            </a>
            <a
              href="https://www.instagram.com/finestburu?igsh=dXVwdzY1dDdhdGdm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-400 transition"
            >
              <FaInstagram size={32} />
            </a>
            <a
              href="https://wa.me/254753668073"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-400 transition"
            >
              <FaWhatsapp size={32} />
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-10">
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow">
            <h3 className="text-xl font-bold text-blue-800">Trading Softwares</h3>
            <p className="text-gray-700 mt-2">
              Automate your trading and boost efficiency. Gain the edge you need with our advanced bots.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow">
            <h3 className="text-xl font-bold text-blue-800">Trading Classes</h3>
            <p className="text-gray-700 mt-2">
              Learn to trade like a pro. Join our expert-led classes and elevate your skills.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white text-center py-3 px-4 mt-12">
        <p>&copy; 2025 Finesttraders. All rights reserved.</p>
      </footer>
    </div>
  );
}
