import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import Info from "./Info";
import Typing from "../assets/typing.svg"
import { useDataLayer } from "../datalayer";

export default function ChatContainer({ currentChat, socket , id}) {
  const [messages, setMessages] = useState([]);
  const [info, setInfo] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();
  // const id = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, dispatch] = useDataLayer();

  useEffect(async () => {
    // const data = await JSON.parse(
    //   localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    // );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem("User")
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    // const data = await JSON.parse(
    //   localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    // );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    console.log(currentChat._id)
    // id.current = currentChat._id
    if (socket.current) {
      socket.current.on(`msg-recieve-${id.current}`, (msg) => {
        console.log("Message from ", id.current)
        setTyping(false);
        setArrivalMessage({ fromSelf: false , message: msg.msg });
      });
    }
  }, [currentChat]);
  let timeout;
  useEffect(() => {
    socket.current.on(`typing-${currentChat._id}`,(mes) =>{
      setTyping(true);
      timeout = setTimeout(() => {
        setTyping(false);
      }, 5000)
    })
  }, [currentChat])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details" onClick={() => {setInfo(!info)}}>
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        {
          info ?
          <Info/>
          :
          ""
        }
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        {
          typing ?
          <div ref={scrollRef}>
            <div className="message recieved">
              <div className="content">
                <img src={Typing} alt="" />
              </div>
            </div>
          </div>
          :
          ""
        }
      </div>
      <ChatInput currentChat = {currentChat} socket = {socket} handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 0px 2rem 0px 1rem;
    /* border: 1px solid red; */
    height: fit-content;
    .user-details {
      display: flex;
      position: relative;
      align-items: center;
      gap: 1rem;
      padding: 5px 15px;
      border-radius: 12px;
      cursor: pointer;
      .avatar {
        img {
          height: 2.3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
      :hover{
        /* border: 1px solid grey; */
        background-color: grey;
        transition: all 0.25s ease-in-out;
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
