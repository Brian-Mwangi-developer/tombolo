import Header from '../header'; // Adjust the path if needed
import { FaRobot } from 'react-icons/fa';
import Footer from '../footer';

export default function AIBotsPage() {
  const bots = [
    {
      name: 'Dollar Killer',
      description:
        'A precision-driven bot designed to identify and capitalize on high-potential trades, helping you maximize profits with minimal effort.',
      price: '10,000',
    },
    {
      name: 'Deriv Miner',
      description:
        'A powerful bot that digs deep into market trends to uncover consistent and reliable trading opportunities.',
      price: '10,000',
    },
    {
      name: 'Dollar Flipper',
      description:
        'A fast-paced bot tailored for quick-turnaround trades, flipping market movements into profitable gains.',
      price: '15,000',
    },
  ];

  // Function to generate WhatsApp link with bot info
  const generateWhatsAppLink = (botName: string, price: string) => {
    const phoneNumber = '+254753668073';
    const message = `Hi, I am interested in purchasing the ${botName} bot for KES ${price}.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 mt-20 md:mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white py-10">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-4">Explore AI Bots</h1>
            <p className="text-xl">
              Transform your trading experience with our state-of-the-art AI-powered bots.
            </p>
          </div>
        </section>

        {/* Bots Grid */}
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-semibold text-center text-blue-800 mb-8">Available Bots</h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-2xl transition-shadow transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 flex items-center justify-center">
                  <FaRobot className="text-white text-6xl" />
                </div>
                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-blue-800">{bot.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{bot.description}</p>
                  <p className="text-lg font-semibold text-gray-800 mb-6">
                    Price: <span className="text-yellow-600">KES {bot.price}</span>
                  </p>
                  <a
                    href={generateWhatsAppLink(bot.name, bot.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900">
                      Buy Now
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
