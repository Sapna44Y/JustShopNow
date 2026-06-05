import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 gap-6">
      {/* Left Column - Product Images + Why Shop Section */}
      <div className="flex flex-col gap-4">
        {/* Product Images */}
        <div>
          <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
            <img
              src={data.image[image]}
              className="w-full h-full object-scale-down"
              alt={data.name}
            />
          </div>
          <div className="flex items-center justify-center gap-3 my-2">
            {data.image.map((img, index) => {
              return (
                <div
                  key={img + index + "point"}
                  className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}
                ></div>
              );
            })}
          </div>
          <div className="grid relative">
            <div
              ref={imageContainer}
              className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
            >
              {data.image.map((img, index) => {
                return (
                  <div
                    className="w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md"
                    key={img + index}
                  >
                    <img
                      src={img}
                      alt="min-product"
                      onClick={() => setImage(index)}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                );
              })}
            </div>
            <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
              <button
                onClick={handleScrollLeft}
                className="z-10 bg-white relative p-1 rounded-full shadow-lg"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={handleScrollRight}
                className="z-10 bg-white relative p-1 rounded-full shadow-lg"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>

        {/* Why shop from JustShoppingNow? Section - Left Side Below Images */}
        <div className="mt-4">
          <h2 className="font-semibold text-lg mb-4">
            Why shop from JustShoppingNow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Superfast Delivery */}
            <div className="flex flex-col items-center text-center gap-2">
              <img
                src={image1}
                alt="superfast delivery"
                className="w-16 h-16 object-contain"
              />
              <div className="font-semibold">Superfast Delivery</div>
              <p className="text-sm text-gray-600">
                Get your order delivered to your doorstep at the earliest from
                dark stores near you.
              </p>
            </div>

            {/* Best Prices & Offers */}
            <div className="flex flex-col items-center text-center gap-2">
              <img
                src={image2}
                alt="Best prices offers"
                className="w-16 h-16 object-contain"
              />
              <div className="font-semibold">Best Prices & Offers</div>
              <p className="text-sm text-gray-600">
                Best price destination with offers directly from the
                manufacturers.
              </p>
            </div>

            {/* Wide Assortment */}
            <div className="flex flex-col items-center text-center gap-2">
              <img
                src={image3}
                alt="Wide Assortment"
                className="w-16 h-16 object-contain"
              />
              <div className="font-semibold">Wide Assortment</div>
              <p className="text-sm text-gray-600">
                Choose from 5000+ products across food personal care, household
                & other categories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Product Info (Name, Price, Stock, Details) */}
      <div className="p-4 lg:pl-0 text-base lg:text-lg flex flex-col gap-3">
        <p className="bg-green-300 w-fit px-2 rounded-full">10 Min</p>
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <p className="">{data.unit}</p>
        <Divider />

        <div>
          <p className="">Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(
                  pricewithDiscount(data.price, data.discount),
                )}
              </p>
            </div>
            {data.discount && (
              <p className="line-through">{DisplayPriceInRupees(data.price)}</p>
            )}
            {data.discount && (
              <p className="font-bold text-green-600 lg:text-2xl">
                {data.discount}%{" "}
                <span className="text-base text-neutral-500">Discount</span>
              </p>
            )}
          </div>
        </div>

        {data.stock === 0 ? (
          <p className="text-lg text-red-500 my-2">Out of Stock</p>
        ) : (
          <div className="my-4">
            <AddToCartButton data={data} />
          </div>
        )}

        <Divider />

        {/* Product Details Section - On Right Side */}
        <ProductDetails data={data} />
      </div>
    </section>
  );
};

// Product Details Component
const ProductDetails = ({ data }) => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-semibold">Description</p>
        <p className="text-base">{data.description}</p>
      </div>
      <div>
        <p className="font-semibold">Unit</p>
        <p className="text-base">{data.unit}</p>
      </div>
      {data?.more_details &&
        Object.keys(data?.more_details).map((element, index) => {
          return (
            <div key={element + index}>
              <p className="font-semibold">{element}</p>
              <p className="text-base">{data?.more_details[element]}</p>
            </div>
          );
        })}
    </div>
  );
};

export default ProductDisplayPage;
