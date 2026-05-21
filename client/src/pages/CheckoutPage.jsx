import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
  } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
        if (fetchOrder) {
          fetchOrder();
        }
        // Pass order details to success page
        navigate("/success", {
          state: {
            text: "Order",
            orderItems: cartItemsList,
            orderTotal: totalPrice,
            orderId: responseData.orderId || responseData.data?._id,
            paymentMethod: "Cash on Delivery",
            address: addressList[selectAddress],
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      // Store order details in sessionStorage for success page after payment
      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          orderItems: cartItemsList,
          orderTotal: totalPrice,
          address: addressList[selectAddress],
        }),
      );

      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      if (fetchCartItem) {
        fetchCartItem();
      }
      if (fetchOrder) {
        fetchOrder();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-blue-50 min-h-screen">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/***address***/}
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  key={index}
                  htmlFor={"address" + index}
                  className={!address.status && "hidden"}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={"address" + index}
                        type="radio"
                        value={index}
                        checked={selectAddress === index}
                        onChange={(e) =>
                          setSelectAddress(parseInt(e.target.value))
                        }
                        name="address"
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>

          {/***Order Summary Items***/}
          {cartItemsList.length > 0 && (
            <div className="mt-6 bg-white p-4">
              <h3 className="text-lg font-semibold mb-3">Your Items</h3>
              <div className="space-y-3 max-h-96 overflow-auto">
                {cartItemsList.map((item, index) => (
                  <div key={index} className="flex gap-3 border-b pb-3">
                    <div
                      className="w-16 h-16 bg-gray-100 rounded overflow-hidden cursor-pointer"
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
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => handleProductClick(item?.productId?._id)}
                      >
                        {item?.productId?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item?.productId?.unit}
                      </p>
                      <p className="text-sm font-semibold">
                        Qty: {item?.quantity} ×{" "}
                        {DisplayPriceInRupees(
                          pricewithDiscount(
                            item?.productId?.price,
                            item?.productId?.discount,
                          ),
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {DisplayPriceInRupees(
                          pricewithDiscount(
                            item?.productId?.price,
                            item?.productId?.discount,
                          ) * item?.quantity,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/**summary**/}
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quantity total</p>
              <p className="flex items-center gap-2">{totalQty} item(s)</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4 border-t pt-2 mt-2">
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          {addressList.length === 0 && (
            <div className="text-red-500 text-sm text-center mb-4">
              Please add an address to proceed
            </div>
          )}

          <div className="w-full flex flex-col gap-4">
            <button
              className={`py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold ${
                addressList.length === 0 && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleOnlinePayment}
              disabled={addressList.length === 0}
            >
              Online Payment
            </button>

            <button
              className={`py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white ${
                addressList.length === 0 && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleCashOnDelivery}
              disabled={addressList.length === 0}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
