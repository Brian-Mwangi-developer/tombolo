'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = () => {
      // Extract query parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const acct1 = urlParams.get('acct1');
      const token1 = urlParams.get('token1');

      

      // Check if the required parameters are available
      if (acct1 && token1) {
        // Store the token in cookies (with secure flags in production)
        document.cookie = `access_token=${token1}; path=/; Secure; SameSite=Strict`;

        // Redirect to the dashboard and pass a success message
        router.push('/dashboard?loginSuccess=true');
      } else {
        router.push('/'); // Redirect to home if info is missing
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100 flex flex-col justify-center items-center">
      {/* Logo with heartbeat animation */}
      <div className="relative">
        <img
          src="/LOGO.png"
          alt="Processing Logo"
          className="h-54 w-54 animate-bounce-heart"
        />
      </div>
      <h1 className="mt-6 text-blue-800 font-bold text-2xl">Processing login...</h1>

      {/* Custom heartbeat animation */}
      <style jsx>{`
        @keyframes bounce-heart {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }
        .animate-bounce-heart {
          animation: bounce-heart 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
