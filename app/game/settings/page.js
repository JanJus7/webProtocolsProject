"use client";

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = Cookies.get("userId");
    if (!userId) {
      setError("User is not logged in.");
      return;
    }

    try {
      const response = await axios.patch(
        `/api/user/currentUser?userId=${userId}`,
        {
          username: newUsername,
        }
      );

      if (response.status === 200) {
        setMessage("Username updated successfully!");
        setError("");
        setNewUsername("");
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update username.");
      setMessage("");
    }
  };

  const handleDeleteAccount = async () => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    try {
      await axios.delete("/api/user/currentUser", {
        data: { userId },
      });

      Cookies.remove("userId");
      router.push("/l");
    } catch (error) {
      setError("Failed to delete account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-300">
          Change Username
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              New Username
            </label>
            <input
              type="text"
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter new username"
              required
            />
          </div>
          {message && (
            <p className="text-green-500 text-sm mb-4 text-center">{message}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Username
          </button>
        </form>
      </div>
      <div className="bg-white mt-4 p-5 rounded-lg shadow-lg w-full max-w-md flex justify-center items-center text-red-500">
        <button
          className="hover:bg-gray-100 bg-gray-50 p-3 rounded-lg"
          onClick={handleDeleteAccount}
        >
          Delete account
          <FontAwesomeIcon size="xl" icon={faTrashCan} className="pl-2" />
        </button>
      </div>
    </div>
  );
}