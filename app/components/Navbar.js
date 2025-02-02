"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function Navbar() {
  const [showDetails, setShowDetails] = useState(false);
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const userId = Cookies.get("userId");
  const pathname = usePathname();
  const router = useRouter();

  const isGuest = pathname === "/game/guest-session";

  const handleLogout = () => {
    Cookies.remove("userId");
    router.push("/");
  };

  useEffect(() => {
    if (userId && !isGuest) {
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
  }, [userId, isGuest]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";

  return (
    <div className="flex justify-between items-center min-w-full fixed top-0 z-50 p-4">
      <Link href={isGuest ? "/" : "/menu"}>
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
        <div className="flex justify-center items-center flex-col absolute top-12 right-4 bg-white p-4 shadow-lg rounded-lg">
          {isGuest ? (
            <p className="text-gray-700">
              Guest session. No data is collected.
            </p>
          ) : (
            <>
              <p className="text-gray-700">Username: {username}</p>
              <p className="text-gray-700">Account created: {formattedDate}</p>
              <button
                onClick={handleLogout}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
              >
                Logout...
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
