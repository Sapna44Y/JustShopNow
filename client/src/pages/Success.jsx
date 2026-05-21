import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Check if order details came from navigation state
    if (location?.state?.orderItems) {
      setOrderDetails({
        orderItems: location.state.orderItems,
        orderTotal: location.state.orderTotal,
        orderId: location.state.orderId,
        paymentMethod: location.state.paymentMethod,
        address: location.state.address,
        text: location.state.text,
      });
    }
    // Check sessionStorage for online payment orders
    else {
      const pendingOrder = sessionStorage.getItem("pendingOrder");
      if (pendingOrder) {
        const parsedOrder = JSON.parse(pendingOrder);
        setOrderDetails({
          orderItems: parsedOrder.orderItems,
          orderTotal: parsedOrder.orderTotal,
          address: parsedOrder.address,
          text: "Payment",
          paymentMethod: "Online Payment",
          orderId: "Processing",
        });
        // Clear sessionStorage after retrieving
        sessionStorage.removeItem("pendingOrder");
      }
    }
  }, [location]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!orderDetails) {
    return (
      <div className="m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5">
        <p className="text-green-800 font-bold text-lg text-center">
          Order Successfully Placed!
        </p>
        <Link
          to="/"
          className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1"
        >
          Go To Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl">
        {/* Success Message */}
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-bold text-lg">
                {orderDetails.text || "Order"} Successfully Completed!
              </p>
              <p className="text-green-700">Thank you for your purchase</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-xl font-semibold">Order Details</h2>
            {orderDetails.orderId && orderDetails.orderId !== "Processing" && (
              <p className="text-sm text-gray-600 mt-1">
                Order ID: {orderDetails.orderId}
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {orderDetails.orderItems?.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-3">
                  <div
                    className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer"
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
                    <p className="text-sm text-gray-600 mt-1">
                      Quantity: {item?.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {DisplayPriceInRupees(
                        pricewithDiscount(
                          item?.productId?.price,
                          item?.productId?.discount,
                        ) * (item?.quantity || 1),
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {DisplayPriceInRupees(
                        pricewithDiscount(
                          item?.productId?.price,
                          item?.productId?.discount,
                        ),
                      )}{" "}
                      each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Address Info */}
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Payment Method
                </h4>
                <p className="text-gray-600">
                  {orderDetails.paymentMethod || "Cash on Delivery"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Order Total
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {DisplayPriceInRupees(orderDetails.orderTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {orderDetails.address && (
            <div className="p-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Shipping Address
              </h4>
              <div className="text-gray-600">
                <p>{orderDetails.address.address_line}</p>
                <p>
                  {orderDetails.address.city}, {orderDetails.address.state}
                </p>
                <p>
                  {orderDetails.address.country} -{" "}
                  {orderDetails.address.pincode}
                </p>
                <p>Phone: {orderDetails.address.mobile}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/dashboard/myorders"
            className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-600 hover:text-white transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
