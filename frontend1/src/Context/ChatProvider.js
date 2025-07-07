import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(false);
  const [Notification, setNotification] = useState([]);

  const [chats, setChats] = useState([
    {
      isGroupChat: false,
      users: [
        {
          name: "John Doe",
          email: "john@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
      ],
      _id: "617a077e18c25468bc7c4dd4",
      chatName: "John Doe",
    }
  ]);
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("userinfo"))
  );
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        Notification,
        setNotification,
        theme,
        setTheme,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
