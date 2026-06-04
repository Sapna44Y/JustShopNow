import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaRegUserCircle,
  FaStore,
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
} from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { TbSwitchHorizontal } from "react-icons/tb";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = async (newRole) => {
    if (newRole === user.role) {
      toast.error(
        `You are already a ${newRole === "ADMIN" ? "Seller" : "Customer"}`,
      );
      return;
    }

    try {
      setRoleLoading(true);
      const confirmSwitch = window.confirm(
        `Are you sure you want to switch to ${newRole === "ADMIN" ? "Seller" : "Customer"} mode?\n\n${
          newRole === "ADMIN"
            ? "As a Seller, you can add products, manage inventory, and view orders."
            : "As a Customer, you can browse and purchase products."
        }`,
      );
      if (!confirmSwitch) return;

      const response = await Axios({
        ...SummaryApi.switchUserRole,
        data: { role: newRole },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(
          `Switched to ${newRole === "ADMIN" ? "Seller" : "Customer"} mode`,
        );
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Cover Banner */}
        <div className="h-24 bg-gradient-to-r from-green-400 to-green-600"></div>

        {/* Avatar Section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full overflow-hidden border-4 border-white shadow-lg">
                {user.avatar ? (
                  <img
                    alt={user.name}
                    src={user.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaRegUserCircle size={70} className="text-gray-400" />
                )}
              </div>
              <button
                onClick={() => setProfileAvatarEdit(true)}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition"
              >
                <HiOutlinePencilAlt className="text-gray-600 text-sm" />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role === "ADMIN" ? "🛍️ Seller(Vendor)" : "👤 Customer"}
                </span>
                {user.verify_email && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <FaCheckCircle size={12} />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switch Card - Seller/Customer Toggle */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-green-100">
        <div className="flex items-center gap-3 mb-3">
          <TbSwitchHorizontal className="text-green-600 text-xl" />
          <h3 className="font-semibold text-gray-800">Switch Mode</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Customer Mode Button */}
          <button
            onClick={() => handleRoleSwitch("USER")}
            disabled={roleLoading || user.role === "USER"}
            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl transition-all ${
              user.role === "USER"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-md"
            }`}
          >
            <FaUser size={20} />
            <div className="text-left">
              <div className="font-semibold">Customer Mode</div>
              <div className="text-xs opacity-80">
                Buy products & place orders
              </div>
            </div>
            {user.role === "USER" && (
              <FaCheckCircle size={16} className="ml-auto" />
            )}
          </button>

          {/* Seller Mode Button */}
          <button
            onClick={() => handleRoleSwitch("ADMIN")}
            disabled={roleLoading || user.role === "ADMIN"}
            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl transition-all ${
              user.role === "ADMIN"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-md"
            }`}
          >
            <FaStore size={20} />
            <div className="text-left">
              <div className="font-semibold">Seller ( Vendor ) Mode</div>
              <div className="text-xs opacity-80">
                Add products & manage store
              </div>
            </div>
            {user.role === "ADMIN" && (
              <FaCheckCircle size={16} className="ml-auto" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          {user.role === "ADMIN"
            ? "✨ You're in Seller mode. Add products, manage inventory, and fulfill orders."
            : "🛒 You're in Customer mode. Browse products and place orders."}
        </p>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Personal Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Update your personal details
          </p>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUser className="text-gray-400" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 bg-gray-50 outline-none border border-gray-200 focus:border-green-400 rounded-xl transition"
              value={userData.name}
              name="name"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaEnvelope className="text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-50 outline-none border border-gray-200 focus:border-green-400 rounded-xl transition"
              value={userData.email}
              name="email"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaPhone className="text-gray-400" />
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              placeholder="Enter your mobile number"
              className="w-full p-3 bg-gray-50 outline-none border border-gray-200 focus:border-green-400 rounded-xl transition"
              value={userData.mobile}
              name="mobile"
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Avatar Edit Modal */}
      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}
    </div>
  );
};

export default Profile;
