import React from "react";

export default function OrdersLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[50vh] space-y-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <div className="w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">K</span>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-brand-navy">Loading Orders...</h2>
        <p className="text-sm text-gray-400 mt-1">Fetching order overview</p>
      </div>
    </div>
  );
}
