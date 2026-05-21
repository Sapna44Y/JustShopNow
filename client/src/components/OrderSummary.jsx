import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

const OrderSummary = ({
  orderItems,
  total,
  showAddress = false,
  address = null,
}) => {
  if (!orderItems || orderItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Order Items</h3>
        <div className="space-y-3 max-h-96 overflow-auto">
          {orderItems.map((item, index) => (
            <div key={index} className="flex gap-4 border-b pb-3">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                <img
                  src={item?.productId?.image?.[0]}
                  alt={item?.productId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {item?.productId?.name}
                </p>
                <p className="text-sm text-gray-500">{item?.productId?.unit}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item?.quantity || 1}
                </p>
                <p className="font-semibold text-green-600">
                  {DisplayPriceInRupees(
                    pricewithDiscount(
                      item?.productId?.price,
                      item?.productId?.discount,
                    ) * (item?.quantity || 1),
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">{DisplayPriceInRupees(total)}</span>
          </div>
          {showAddress && address && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Address:</span>
                <span className="text-right max-w-[200px]">
                  {address.address_line}, {address.city},{address.state},{" "}
                  {address.country} - {address.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span>{address.mobile}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
