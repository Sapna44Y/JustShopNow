import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Cancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cancelDetails, setCancelDetails] = useState(null);

  useEffect(() => {
    // Check if there are any order details passed
    if (location?.state) {
      setCancelDetails(location.state);
    } else {
      // Check sessionStorage for cancelled order
      const cancelledOrder = sessionStorage.getItem("cancelledOrder");
      if (cancelledOrder) {
        setCancelDetails(JSON.parse(cancelledOrder));
        sessionStorage.removeItem("cancelledOrder");
      }
    }
  }, [location]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl">
        {/* Cancel Message */}
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-bold text-lg">
                {cancelDetails?.text || "Order"} Cancelled
              </p>
              <p className="text-red-700">
                {cancelDetails?.message ||
                  "Your order has been cancelled. No payment has been processed."}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items that were cancelled */}
        {cancelDetails?.orderItems && cancelDetails.orderItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b p-4 bg-gray-50">
              <h2 className="text-xl font-semibold">Cancelled Items</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {cancelDetails.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b pb-3">
                    <div
                      className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => handleProductClick(item?.productId?._id)}
                    >
                      <img
                        src={item?.productId?.image?.[0]}
                        alt={item?.productId?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="font-medium text-gray-800 cursor-pointer hover:text-blue-600"
                        onClick={() => handleProductClick(item?.productId?._id)}
                      >
                        {item?.productId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item?.productId?.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item?.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
