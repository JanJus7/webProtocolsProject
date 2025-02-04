"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faGear } from "@fortawesome/free-solid-svg-icons";

export default function Menu() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const userId = Cookies.get("userId");

  const handleLogout = () => {
    Cookies.remove("userId");
    router.push("/");
  };

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

  const handleNewGame = async () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      console.error("User ID not found in cookies");
      return;
    }

    try {
      const response = await axios.post("/api/game", { userId });
      const gameId = response.data.gameId;

      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error("Failed to create a new game:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex justify-center items-center flex-col rounded-3x h-96 w-96 bg-gray-200 fixed left-64 rounded-3xl">
        <Link
          href={"/game/websocket"}
          className="text-center bg-yellow-500 text-white py-2 px-3 w-40 rounded-lg hover:bg-yellow-600 mt-2"
        >
          Click here to chat!
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-300">Main Menu</h1>
        <button
          onClick={handleNewGame}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4"
        >
          New Game
        </button>
        <Link href="/game/history">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            History
          </button>
        </Link>
      </div>
      <div className="flex justify-center items-center flex-col rounded-3xl h-96 w-96 bg-gray-200 fixed right-64">
        <FontAwesomeIcon
          size="7x"
          icon={faFaceSmile}
          className=" text-blue-500"
        />
        <p className="text-gray-700 mt-8">Username: {username}</p>
        <p className="text-gray-700">Account created: {formattedDate}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4 px-4 py-3"
        >
          Logout...
        </button>
        <Link href={"/game/settings"}>
          <FontAwesomeIcon
            size="xl"
            icon={faGear}
            className="bg-yellow-300 rounded-lg hover:bg-yellow-500 mt-2 px-4 py-3 text-yellow-500 hover:text-yellow-700"
          />
        </Link>
        <Link href="/game/friends">
          <button className="bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 mt-2">
            Friends
          </button>
        </Link>
      </div>
    </div>
  );
}
