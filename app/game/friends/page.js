"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [friendStatus, setFriendStatus] = useState({});
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `/api/user/currentUser?userId=${userId}`
        );
        setFriends(response.data.friends || []);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      const response = await axios.get(
        `/api/user?username=${newFriendUsername}`
      );
      const friendId = response.data.userId;

      await axios.post("/api/user/friends", { userId, friendId });
      setNewFriendUsername("");
      const response2 = await axios.get(
        `/api/user/currentUser?userId=${userId}`
      );
      setFriends(response2.data.friends || []);
    } catch (error) {
      console.error("Failed to add friend:", error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete("/api/user/friends", { data: { userId, friendId } });
      setFriends(
        friends.filter((f) => f.friendId.toString() !== friendId.toString())
      );
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  const handleUpdateFriendStatus = async (friendId, status) => {
    try {
      await axios.put("/api/user/friends", { userId, friendId, status });
      setFriendStatus((prev) => ({ ...prev, [friendId]: status }));
    } catch (error) {
      console.error("Failed to update friend status:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-300">
          Friends
        </h1>

        <div className="mb-4">
          <input
            type="text"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter friend's username"
          />
          <button
            onClick={handleAddFriend}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2"
          >
            Add Friend
          </button>
        </div>

        <ul>
          {friends &&
            friends.map((friend) => (
              <li
                key={friend.friendId.toString()}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4"
              >
                <div>
                  <p className="text-gray-700">{friend.friendId.toString()}</p>{" "}
                  <p className="text-gray-500">
                    Status: {friendStatus[friend.friendId]}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleRemoveFriend(friend.friendId)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
