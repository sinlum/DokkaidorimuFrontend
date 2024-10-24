"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisV,
  faPaperPlane,
  faSearch,
  faHeart,
  faStarHalf,
  faStar,
  faFish,
  faCheck,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { Client } from "@stomp/stompjs";
import debounce from "lodash/debounce";
import { getProfileImageUrl } from "../_util/helper";
import { useUser } from "../_components/userContext";

const MessagePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchUsers();
    connectWebSocket();
    fetchUnreadCounts();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      console.log("Connected: " + frame);
      setStompClient(client);
      setConnectionStatus("Connected");
    };

    client.onStompError = function (frame) {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      setConnectionStatus("Error: " + frame.headers["message"]);
    };

    client.onWebSocketError = function (event) {
      console.error("WebSocket error observed:", event);
      setConnectionStatus("WebSocket Error");
    };

    client.onWebSocketClose = function (event) {
      console.log("WebSocket Connection Closed", event);
      setConnectionStatus("Disconnected");
    };

    client.activate();
  };

  useEffect(() => {
    if (stompClient && user) {
      const subscription = stompClient.subscribe(
        `/user/${user.id}/queue/messages`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("Received new message:", receivedMessage);

          setMessages((prevMessages) => [...prevMessages, receivedMessage]);

          // Update unread count if the chat is not currently open
          if (!selectedUser || selectedUser.id !== receivedMessage.sender.id) {
            setUnreadCounts((prevCounts) => ({
              ...prevCounts,
              [receivedMessage.sender.id]:
                (prevCounts[receivedMessage.sender.id] || 0) + 1,
            }));
          }
        }
      );

      const readSubscription = stompClient.subscribe(
        `/user/${user.id}/queue/messageRead`,
        (notification) => {
          const updatedMessage = JSON.parse(notification.body);
          console.log("Received read receipt:", updatedMessage);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? { ...msg, read: true } : msg
            )
          );
        }
      );

      return () => {
        subscription.unsubscribe();
        readSubscription.unsubscribe();
      };
    }
  }, [stompClient, user, selectedUser]);

  useEffect(() => {
    let reconnectInterval;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    if (connectionStatus === "Disconnected") {
      reconnectInterval = setInterval(() => {
        if (reconnectAttempts < maxReconnectAttempts) {
          console.log(
            `Attempting to reconnect... (Attempt ${reconnectAttempts + 1})`
          );
          connectWebSocket();
          reconnectAttempts++;
        } else {
          console.log("Max reconnection attempts reached");
          clearInterval(reconnectInterval);
          setConnectionStatus("Failed to reconnect");
        }
      }, 5000);
    }

    return () => {
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
    };
  }, [connectionStatus]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchUnreadCounts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/messages/unread-counts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch unread counts");
      const data = await response.json();
      console.log("unreadCount:", data);
      setUnreadCounts(data);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  const searchUsers = useCallback(async (query) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/search?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => searchUsers(query), 300),
    [searchUsers]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      fetchUsers(); // Fetch all users when search query is empty
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchMessages = async (userId) => {
    setIsLoadingMessages(true);
    try {
      console.log(`Fetching messages for user ${userId}`);
      const response = await fetch(
        `http://localhost:8080/api/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched messages:", data);
      setMessages(data);

      // Mark unread messages as read if there's a selected user
      if (selectedUser && selectedUser.id === userId) {
        data.forEach((message) => {
          if (message.recipient.id === user.id && !message.read) {
            markMessageAsRead(message.id);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const markMessageAsRead = useCallback(
    async (messageId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/messages/${messageId}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to mark message as read");

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );

        // Decrease unread count for the sender
        if (selectedUser) {
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [selectedUser.id]: Math.max(
              0,
              (prevCounts[selectedUser.id] || 0) - 1
            ),
          }));
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    },
    [selectedUser]
  );
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "" && stompClient && selectedUser) {
      const message = {
        sender: { id: user.id },
        recipient: { id: selectedUser.id },
        content: newMessage,
        read: false,
        authToken: localStorage.getItem("token"),
      };
      console.log("sending Message:", message);
      try {
        stompClient.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(message),
        });
        setNewMessage("");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            sender: { id: user.id },
            recipient: { id: selectedUser.id },
            content: newMessage,
            timestamp: new Date().toISOString(),
            isRead: false,
          },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Show an error message to the user
        alert("Failed to send message. Please try again.");
      }
    }
  };
  const sendReadReceipt = useCallback(
    async (messageId) => {
      if (stompClient) {
        const readReceipt = {
          messageId: messageId,
          readerId: user.id,
        };
        console.log("Sending read receipt:", readReceipt);
        stompClient.publish({
          destination: "/app/chat.messageRead",
          body: JSON.stringify(readReceipt),
        });

        // Immediately update the UI for the reader
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      }
    },
    [stompClient, user?.id]
  );

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchMessages(selectedUser.id);
    // Reset unread count for the selected user
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [selectedUser.id]: 0,
    }));
  };

  useEffect(() => {
    if (selectedUser) {
      // Mark unread messages as read when a user is selected
      messages.forEach((message) => {
        if (message.sender.id === selectedUser.id && !message.read) {
          markMessageAsRead(message.id);
        }
      });
    }
  }, [selectedUser, messages, markMessageAsRead]);

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const renderUserList = () => (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gradient-to-b from-blue-100 to-green-100 border-r border-blue-200 overflow-y-auto h-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          おともだちの海
        </h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="ともだちをさがす..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-white text-blue-600 placeholder-blue-400"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
          />
        </div>
      </div>
      {users
        .filter((u) => u?.id !== user?.id)
        .map((otherUser) => (
          <div
            key={otherUser.id}
            className={`flex items-center p-4 border-b border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
              selectedUser && selectedUser?.id === otherUser?.id
                ? "bg-blue-200"
                : ""
            }`}
            onClick={() => handleUserSelect(otherUser)}
          >
            <div className="relative">
              <img
                src={
                  getProfileImageUrl(otherUser.imgUrl) || "/default-avatar.png"
                }
                alt={otherUser.username || "ユーザー"}
                className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-300"
              />
              {onlineUsers.has(otherUser.id) && (
                <div className="absolute bottom-0 right-3 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-blue-700 truncate">
                  {otherUser.username || "おともだち"}
                </h3>
                {unreadCounts[otherUser.id] > 0 && (
                  <span className="bg-yellow-300 text-blue-700 text-xs font-bold rounded-full px-2 py-1 ml-2 animate-bounce">
                    {unreadCounts[otherUser.id]}
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-500 truncate flex items-center">
                <FontAwesomeIcon
                  icon={faFish}
                  className="mr-1 text-green-400 animate-pulse"
                />
                {otherUser.status || "うみのなかだよ！"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );

  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      const unreadMessages = messages.filter(
        (message) => message.recipient.id === user.id && !message.read
      );
      unreadMessages.forEach((message) => {
        sendReadReceipt(message.id);
      });
    }
  }, [selectedUser, messages, user.id, sendReadReceipt]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);
  const renderChatArea = () => {
    let currentDate = null;

    return (
      <div className="flex-1 flex flex-col mt-[8px] h-full">
        {/* Chat header */}
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-3 flex items-center justify-between shadow-sm">
          {isMobile && (
            <button onClick={handleBackToList} className="text-purple-500 mr-3">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          <div className="flex items-center">
            <img
              src={
                getProfileImageUrl(selectedUser.imgUrl) || "/default-avatar.png"
              }
              alt={selectedUser.username || "ユーザー"}
              className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-purple-500"
            />
            <div>
              <h2 className="text-xl font-semibold text-purple-800">
                {selectedUser.username || "匿名ユーザー"}
              </h2>
            </div>
          </div>
          <button className="text-purple-600 hover:text-purple-800">
            <FontAwesomeIcon icon={faStar} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto p-4 bg-yellow-50 flex flex-col-reverse"
        >
          {isLoadingMessages ? (
            <p className="text-center text-purple-500 mt-4">
              メッセージを読み込んでいます...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-purple-500 mt-4">
              まだメッセージがありません。会話を始めましょう！
            </p>
          ) : (
            [...messages].reverse().map((message, index, array) => {
              const messageDate = new Date(message.timestamp);
              let showDateHeader = false;

              if (
                index === array.length - 1 ||
                !isSameDay(new Date(array[index + 1].timestamp), messageDate)
              ) {
                showDateHeader = true;
                currentDate = messageDate;
              }

              const isCurrentUser = message.sender.id === user.id;

              return (
                <React.Fragment key={message.id}>
                  {showDateHeader && (
                    <div className="text-center my-4">
                      <span className="bg-purple-200 text-purple-600 px-2 py-1 rounded-full text-xs">
                        {isToday(messageDate)
                          ? "今日"
                          : isYesterday(messageDate)
                          ? "昨日"
                          : format(messageDate, "yyyy年M月d日")}
                      </span>
                    </div>
                  )}
                  <div
                    className={`mb-4 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? "bg-purple-400 text-white"
                          : "bg-green-200 text-purple-800 border border-green-300"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-2 ${
                        isCurrentUser ? "justify-end" : "ml-4"
                      }`}
                    >
                      <p className="text-xs text-purple-500">
                        {format(messageDate, "H:mm")}
                      </p>
                      {isCurrentUser && (
                        <FontAwesomeIcon
                          icon={message.read ? faStar : faStarHalf}
                          className={`text-xs ${
                            message.read ? "text-yellow-500" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSendMessage}
          className="bg-yellow-100 border-t border-yellow-200 md:mb-2 px-4 py-3"
        >
          <div className="flex items-center">
            <input
              type="text"
              placeholder="メッセージを入力..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border border-purple-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="ml-3 text-purple-500 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              disabled={!newMessage.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 z-10 md:ml-[40px] overflow-auto pt-20 md:pl-36">
      <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] rounded-2xl shadow-xl overflow-hidden border-4 border-purple-300">
        {(!isMobile || (isMobile && !selectedUser)) && renderUserList()}
        {(!isMobile || (isMobile && selectedUser)) &&
          (selectedUser ? (
            renderChatArea()
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100">
              <p className="text-2xl text-purple-600 font-bold animate-bounce">
                ともだちをえらんでメッセージをはじめよう！
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessagePage;
