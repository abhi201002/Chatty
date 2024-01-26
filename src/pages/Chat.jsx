import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, getFriendRoutes, host, recieveMessageRoute, sendMessageRoute, usersRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { useDataLayer } from "../datalayer";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const currentId = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, dispatch] = useDataLayer()
  const [typing, setTyping] = useState(false);
  const [loadContact, setloadContact] = useState(false);
  const [loadChat, setloadChat] = useState(false);

  useEffect(async () => {
    if (!data._id) {
      navigate("/login");
    } else {
      const profile = await axios.get(`${usersRoute}/${data._id}`);
      localStorage.setItem('User', JSON.stringify(profile.data));
      dispatch({type: "ADD_USER"})
      setCurrentUser(
        profile.data
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        socket.current?.removeAllListeners();
        setloadContact(true);
        const data = await axios.get(`${getFriendRoutes}/${currentUser._id}`);
        setloadContact(false);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const moveItem = (items, id) => {
    let newItem = [...items];
    console.log(newItem)
    let index = newItem.findIndex((item) => {
      return item._id === id;
    });
    console.log(index);
    const item = newItem[index];
    newItem.splice(index, 1);
    newItem.splice(0,0,item);

    return newItem;
  }
  useEffect(() => {
    contacts.forEach((item) =>{
      socket.current.on(`msg-recieve-${item._id}`, (msg) =>{
        if(currentChat && item._id === currentChat._id){ 
          setArrivalMessage({ fromSelf: false , message: msg.msg });
          setTyping(false);
        }
        const newCon = moveItem(contacts, item._id);
        setContacts(newCon);
      });
    })
  },[currentChat, contacts])

  let timeout;
  useEffect(() => {
    if(currentChat){
      socket.current.on(`typing-${currentChat?._id}`,(mes) =>{
        setTyping(true);
        timeout = setTimeout(() => {
          setTyping(false);
        }, 2000)
      })
    }
  }, [currentChat])

  const handleChatChange = (chat) => {
    socket.current.off(`msg-recieve-${currentId.current}`)
    socket.current.off(`typing-${currentId.current}`)
    currentId.current = chat._id;
    setCurrentChat(chat);
  };
  let response;
  useEffect(async () => {
    if(currentChat !== undefined){
      setloadChat(true)
      response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat?._id,
      });
      setloadChat(false)
      setMessage(response?.data);
    }
  }, [currentChat]);

  useEffect(() => {
    arrivalMessage && setMessage((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleSendMsg = async (msg) => {
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
    const newCon = moveItem(contacts, currentChat._id);
    const msgs = [...message];
    msgs.push({ fromSelf: true, message: msg });
    setMessage(msgs);
    setContacts(newCon);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} loading = {loadContact} socket = {socket}/>
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} typing = {typing} messages={message} handleSendMsg = {handleSendMsg} loading = {loadChat}/>
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
