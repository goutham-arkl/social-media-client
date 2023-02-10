import "./messenger.scss";
import "../../style.scss";
// import Topbar from "../../components/topbar/Topbar";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import axios from "../../axios";
import InputEmoji from "react-input-emoji";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "../../context/socketContext";
import { Link } from "react-router-dom";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default function Messenger() {
  const { darkMode } = useContext(DarkModeContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [err, setErr] = useState(false);
  const [reciever, setReciever] = useState(null);
  // const socket = useRef();
  const { currentUser, config } = useContext(AuthContext);
  const scrollRef = useRef();
  const queryClient = new QueryClient();
  const [notCount, setNotCount] = useState(0);
  // const [modalIsOpen, setIsOpen] = useState(false);
  // const [messageReq, setMessageReq] = useState([]);
  const socket = useContext(SocketContext);
  let subtitle;

  // function openModal() {
  //   setIsOpen(true);
  // }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "blue";
  }

  // function closeModal() {
  //   setIsOpen(false);
  // }
  useEffect(() => {
    // socket.current = io("https://socket.prosper-media.cf/");
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  useEffect(() => { 

    if(arrivalMessage){
      if(!currentChat?.members.includes(arrivalMessage.sender)){
        axios.get("/users/" + arrivalMessage.sender,config).then((res)=>{
          toast(`you have a message from ${res.data.username}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
     
      }
    }
  
  }, [arrivalMessage]);
  useEffect(()=>{
    const friendId = currentChat?.members.find((m)=> m !== currentUser._id);
    console.log(friendId);

    if(friendId){
    const getUser = async () =>{
      try{
        const res = await axios.get("/users/"+friendId)
        console.log(res.data);
        setReciever(res.data)
      }catch(err){
        console.log(err);
      }
    }
    getUser()
    };
   
  },[currentUser, currentChat]);
  useEffect(() => {

    socket.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + currentUser._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser._id]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim().length !== 0 && newMessage != null) {
      const receiverId = currentChat.members.find(
        (member) => member !== currentUser._id
      );
      const message = {
        sender: currentUser._id,
        receiverId,
        text: newMessage,
        conversationId: currentChat._id,
      };
      socket.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId,
        text: newMessage,
      });

      try {
        let sendNot = false;
        setNotCount(notCount + 1);
        onlineUsers.includes(receiverId) || notCount === 0
          ? (sendNot = false)
          : (sendNot = true);

        const res = await axios.post(
          "/messages",
          { ...message, sendNot },
          config
        );
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    } else {
      setErr("please enter a message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };
  const handleChange = (newMessage) => {
    setErr(false);
    setNewMessage(newMessage);
  };
  return (
    <>
      <div className={`theme-${darkMode ? "dark" : "light"} animate-slideleft`}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />
        <Navbar />
        <div style={{ display: "flex" }}>
          <QueryClientProvider client={queryClient}>
            <LeftBar />
          </QueryClientProvider>
          <div style={{ flex: 8 }}>
            {/* <div className="msgReq" onClick={openModal}>
              Message requests
            </div> */}
            {/* {messageReq.length > 0 && (
              <div
                className="absolute px-1 py-0.3 bg-red-600 text-white rounded-full text-xs mt-2.5 ml-3.5"
                style={{
                  right: "61px",
                  top: "61px",
                }}
              >
                {" "}
                {messageReq.length}
              </div>
            )} */}
            {/* <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              {messageReq.map((c) => (
                <div
                  onClick={() => {
                    setCurrentChat(
                      c.members.find((m) => m !== currentUser._id)
                    );
                    setIsOpen(false);
                  }}
                  key={c._id}
                >
                  <Conversation
                    conversation={c}
                    currentUser={currentUser}
                  />
                </div>
              ))}
            </Modal> */}
            <div className="messenger">
              <div className="chatMenu">
                <input
                  value="Inbox"
                  className="chatMenuInput"
                  disabled
                  style={{ marginTop: "0.6rem", textAlign: "center" }}
                />
                <div className="chatMenuWrapper">
                {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            ))}
                </div>
              </div>
              <div className="chatBox">
                <div className="chatBoxWrapper">
                  {currentChat && (
                     <><Link to={`/profile/${reciever?._id}`} style={{zIndex:"1000"}}>
                    <img
                      className="messageImg mt-2 "
                      src={
                        reciever?.profilePicture.length !== 0
                          ? reciever?.profilePicture
                          : "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                      }
                      alt=""
                    /></Link></>
                  )}
                  <input
                    value={reciever ? reciever.username : "chat"}
                    className="receiver chatMenuInput"
                    disabled
                  />
                  {currentChat ? (
                    <>
                      <div className="chatBoxTop mt-3">
                        {messages.map((m) => (
                          <div ref={scrollRef} key={m.createdAt}>
                            <Message
                              message={m}
                              own={m.sender === currentUser._id}
                            />
                          </div>
                        ))}
                      </div>
                      {err && err}
                      <div className="chatBoxBottom">
                        <InputEmoji
                          value={newMessage}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        {/* <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {setNewMessage(e.target.value);setErr(false)}}
                    value={newMessage}
                    onKeyDown={handleKeyDown}
                  ></textarea> */}
                        <button
                          className="chatSubmitButton"
                          onClick={handleSubmit}
                        >
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="noConversationText text-center mt-32">
                      Choose a friend to message.
                    </span>
                  )}
                </div>
              </div>
              <div className="chatOnline">
                <div className="chatOnlineWrapper">
                  <ChatOnline
                    onlineUsers={onlineUsers}
                    currentId={currentUser._id}
                    setCurrentChat={setCurrentChat}
                    setReciever={setReciever}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
