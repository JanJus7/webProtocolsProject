"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

function Navbar() {
  const [showDetails, setShowDetails] = useState(false);
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const userId = Cookies.get("userId");

  useEffect(() => {
    if (userId) {
      const getUser = async () => {
        try {
          const response = await axios.get(
            `/api/user/currentUser?userId=${userId}`
          );
          if (response.data) {
            setUsername(response.data.username);
            setCreatedAt(response.data.createdAt);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      getUser();
    }
  }, [userId]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";

  return (
    <div className="flex justify-between items-center min-w-full fixed top-0 z-50 p-4">
      <Link href="/menu">
        <button>
          <FontAwesomeIcon
            icon={faHouse}
            size="lg"
            className="text-blue-500 p-2 bg-blue-200 rounded-lg hover:bg-blue-400 hover:text-blue-700"
          />
        </button>
      </Link>
      <button onClick={() => setShowDetails(!showDetails)}>
        <FontAwesomeIcon
          size="lg"
          icon={faCircleUser}
          className=" text-blue-500 p-2 bg-blue-200 rounded-lg hover:bg-blue-400 hover:text-blue-700"
        />
      </button>

      {showDetails && (
        <div className="absolute top-12 right-4 bg-white p-4 shadow-lg rounded-lg">
          <p className="text-gray-700">Username: {username}</p>
          <p className="text-gray-700">Account created: {formattedDate}</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
