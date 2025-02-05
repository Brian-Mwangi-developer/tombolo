"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
// @ts-ignore
//import SmartChartComponent from "@/components/SmartChartComponent";
import dynamic from "next/dynamic";
import Header from "../header";
import Circles from "@/components/Circles";
import { FaChevronRight } from "react-icons/fa";
import { MdTrendingUp, MdTouchApp } from "react-icons/md";
import { IoMdPulse } from "react-icons/io";
import { BiShuffle } from "react-icons/bi";
import { FaCircle, FaCheckCircle } from "react-icons/fa";


const SmartChartComponent = dynamic(
  () => import('@/components/SmartChartComponent'),
  {
    ssr: false, // Maintain SSR for the wrapper
    loading: () => <div className="chart-loading">Loading trading view...</div>
  }
);




const categories = [
  
  
  {
    title: "",
    items: [
      { name: "Matches/Differs", icon: <MdTouchApp className="text-xl text-purple-500" /> },
      { name: "Even/Odd", icon: <MdTouchApp className="text-xl text-orange-500" /> },
      { name: "Over/Under", icon: <IoMdPulse className="text-xl text-teal-500" /> },
    ],
  },
];

const DerivChartPage = () => {
  const hasReloaded = useRef(false);
  const pathname = usePathname();
  const pageKey = `hasReloaded-${pathname}`;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(pageKey);
    };
  }, [pathname]);

  useEffect(() => {
    if (!hasReloaded.current && !sessionStorage.getItem(pageKey)) {
      hasReloaded.current = true;
      sessionStorage.setItem(pageKey, "true");
      location.reload();
    }
  }, [pageKey]);

  const handleSelectItem = (name: string) => {
    setSelectedItem(name);
    setShowDropdown(false); // Close dropdown after selection
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-y-auto">
      <Header />
      
      <div className="flex flex-col flex-grow">
        
        {/* SmartChartComponent (Top Section) */}
        <div className="relative flex-grow">
          <div className="absolute z-20 bottom-10 -ml-5 mb-9 left-1/2 transform -translate-x-1/2 bg-transparent">
            <Circles />
          </div>
          <SmartChartComponent />
        </div>

        {/* Sidebar (Bottom Section) */}
        <div className="w-full bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500 shadow-lg rounded-lg">
          <div
            className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center space-x-2 -mt-5">
              <MdTrendingUp className="text-yellow-800 text-2xl" />
              <span className="font-semibold text-blue-800 text-lg">Digits</span>
            </div>
            <FaChevronRight
              className={`transition-transform ${showDropdown ? "rotate-90" : ""} text-blue-800`}
            />
          </div>
 
          {/* Show Selected Item Below Accumulators */}
          {selectedItem && (
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-60 rounded-lg shadow-md text-gray-700">
              <span className="font-semibold text-lg">Selected: </span>
              <span>{selectedItem}</span>
            </div>
          )}

          {/* Dropdown Content */}
          {showDropdown && (
            <div className="p-3 border rounded-lg bg-white bg-opacity-80 mt-2">
              {categories.map((category, index) => (
                <div key={index} className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{category.title}</h3>
                  {category.items.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-2 py-2 px-4 rounded-md cursor-pointer transition-all duration-200 ${
                        selectedItem === item.name
                          ? "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white"
                          : "hover:bg-gray-100 text-black" // Added text-black here
                      }`}
                      onClick={() => handleSelectItem(item.name)}
                    >
                      {selectedItem === item.name ? (
                        <FaCheckCircle className="text-white text-lg" />
                      ) : (
                        <FaCircle className="text-gray-400 text-lg" />
                      )}
                      {item.icon}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DerivChartPage;
