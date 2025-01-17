import Header from '../header'; // Adjust the path if needed
import { FaLightbulb, FaBrain, FaChartLine } from 'react-icons/fa';
import Footer from '../footer';

export default function Strategy() {
  const strategies = [
    {
      title: 'Breakout Strategy',
      description:
        'This strategy is all about identifying critical price levels and capitalizing on significant market movements when prices break through key resistance or support levels. Traders anticipate major price shifts when these levels are breached, making it a high-reward, high-risk approach.',
      icon: <FaChartLine className="text-yellow-500 text-6xl" />,
    },
    {
      title: 'Scalping Strategy',
      description:
        'Scalping involves making rapid trades with minimal exposure to capitalize on small price movements. It’s perfect for volatile markets, where small but frequent gains can add up. Scalpers often use high leverage and need a solid grasp of market conditions to avoid unnecessary risks.',
      icon: <FaBrain className="text-yellow-500 text-6xl" />,
    },
    {
      title: 'Swing Trading',
      description:
        'Swing trading leverages market trends and momentum over a period of days to weeks. Traders aim to capitalize on medium-term price swings by entering at an optimal point and exiting once the trend begins to lose momentum, allowing them to make gains while avoiding the noise of short-term fluctuations.',
      icon: <FaLightbulb className="text-yellow-500 text-6xl" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 mt-20 md:mt-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto text-center mt-10">
            <h1 className="text-5xl font-extrabold mb-6">Discover Effective Trading Strategies</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Enhance your trading skills and boost your success with carefully crafted strategies that help you navigate and master the markets.
            </p>
          </div>
        </section>

        {/* Strategies Section */}
        <section className="container mx-auto py-16 px-6">
          <h2 className="text-4xl font-semibold text-center mb-12 text-blue-800">Our Expert Strategies</h2>
          <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow transform hover:-translate-y-4"
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 flex items-center justify-center">
                  {strategy.icon}
                </div>
                {/* Content */}
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-blue-800">{strategy.title}</h3>
                  <p className="text-md text-gray-700 mb-6">{strategy.description}</p>
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
