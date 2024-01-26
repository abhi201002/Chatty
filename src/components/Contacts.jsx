import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Load from "../assets/loading2.svg";
import { useDataLayer } from "../datalayer";
import Search from "./Search";
import Notifcation from "./Notifcation";
import { logoutRoute } from "../utils/APIRoutes";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Profile from "./Profile";

export default function Contacts({ contacts, changeChat , loading, socket}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [search, setSearch] = useState(false)
  const [option, setOption] = useState(false)
  const [profile, setProfile] = useState(false)
  const [notification, setNotification] = useState(false)
  const [data, dispatch] = useDataLayer();
  const navigate = useNavigate();
  useEffect(async () => {
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, [data]);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(contact._id);
    changeChat(contact);
  };
  const changenotify = () => {
    setNotification(false);
  }
  const changeOption = () => {
    setOption(!option);
  }
  const handleLogout = async () => {
    console.log("clicked")
    const id = data._id;
    const Data = await axios.get(`${logoutRoute}/${id}`);
    if (Data.status === 200) {
      localStorage.clear();
      dispatch({type: "REMOVE_USER"});
      navigate("/login");
    }
  };
  const handleSearch = (cond1) => {
      return (
        <>
          <div className={`contacts ${cond1 ? "change": ""}`}>
              {contacts.map((contact, index) => {
                  return (
                  <div
                    key={contact._id}
                    className={`contact ${
                    contact._id === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="avatar">
                      <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt=""
                      />
                      </div>
                      <div className="username">
                      <h3>{contact.username}</h3>
                      </div>
                  </div>
                  );
              })}
          </div>
          <div className={`search ${cond1 ? "change": ""}`}>
            <Search socket = {socket}/>
          </div>
        </>
            )
  }
  const handleSide = (notification, profile) => {
    if(notification){
      return(
        <Notifcation changenotify = {changenotify} socket = {socket}/>
      )
    }
  }
  const handleProfile = () => {
    setProfile(false)
  }
  return (
    <>
      {(
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chatty</h3>
          </div>
          <div className="notify">
            {!notification?
              (<div className="side">
                <div className="friends">
                  <button className={`toggle ${!search? "active":""}`} onClick={() => {setSearch(false)}}>Friends</button>
                  <button className={`toggle ${search? "active":""}`} onClick={() => {setSearch(true)}}>Search</button>
                </div>
                <div className="fri">
                {
                  loading ?
                  <div className="loading">
                    <img src={Load} alt="" />
                    <div>
                      <div>Please Wait,</div> 
                      <div>Building your experience</div>
                    </div>
                  </div>
                  :
                  handleSearch(search)
                }
                </div>
              </div>)
              :
              handleSide(notification, profile)
            }
          </div>
          <div className="current-user">
            <div className="avatar">
              <div className="avatar-circle"></div>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                onClick={() => {changeOption()}}
              />
              <div className={`options ${option ? "visible": ""}`}>
                <button className="option-item" onClick={() => setNotification(true)}>Request</button>
                <button className="option-item"onClick={() => {setProfile(!profile)}}>Edit Profile</button>
                <button className="option-item" onClick={() => {handleLogout()}}>Log Out</button>
              </div>
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
          {profile?
            <Profile profile = {profile} handleProfile = {handleProfile}/>
            :
            ""
          }
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: #080420;
  .brand {
    height: 15%;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .notify{
    height: 70%;
    width: 100%;
  }
  .friends{
    display: flex;
    justify-content: center;
  }
  .friends button{
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }
  .toggle{
    flex: 50%;
    background-color: transparent;
    border: none;
    color: grey;
    padding: 10px 0px;
  }
  .active{
    background-color: #ffffff;
  }
  .side{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .friends{
      width: 100%;
    }
    .fri{
      position: relative;
      height: 90%;
      width: 100%;
      overflow: hidden;
      ::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .contacts.change{
    transition: all 0.35s ease-in-out;
    transform: translateX(-100%);
  }
  .contacts {
    height: 100%;
    width: 100%;
    transition: all 0.35s ease-in-out;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 100%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
      :hover{
        background-color: #808080a1;
      }
    }
    .selected {
      background-color: #9a86f3;
      :hover{
        background-color: #9a86f3;
      }
    }
  }
  .search{
    height: 100%;
    position: relative;
    left: 0px;
    transition: all 0.35s ease-in-out;
    top: -100%;
    transform: translateX(100%);
  }
  .search.change{
    transform: translateX(0);
    transition: all 0.35s ease-in-out;
  }
  .loading{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .loading img{
    height: 50px;
  }
  .loading div{
    text-align: center;
    color: white;
  }

  .current-user {
    height: 15%;
    background-color: #0d0d30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 0px 15px;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
        cursor: pointer;
        border-radius: 50%;
        :hover{
          transform: scale(1.1);
          transition: transform 200ms;
        }
      }
      .avatar-circle{
        position: fixed;
        height: 4rem;
        width: 4rem;
        border: 2px solid grey;
        border-radius: 50%;
        left: inherit;
        right: inherit;
        animation-name: spread;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        pointer-events: none;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  @keyframes spread {
    0%{
      transform: scale(1);
    }
    100%{
      transform: scale(1.3);
      opacity: 0;
    }
  }
  .options{
    display: flex;
    flex-direction: column;
    position: fixed;
    background-color: #19193f;
    opacity: 0;
    bottom: 125px;
    left: 175px;
    transition: all 0.35s ease-in-out;
    transform: translateY(0px);
    visibility: hidden;
  }
  .option-item{
    background-color: transparent;
    transition: all 0.35s ease-in-out;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border: 1px solid black;
    :hover{
      background-color: white;
      color: black;
    }
  }
  .options.visible{
    opacity: 1;
    transition: all 0.35s ease-in-out;
    transform: translateY(20px);
    visibility: visible;
  }
  .user-profile{
    visibility: hidden;
    position: fixed;
    left: 0;
    top: 0;
    margin: auto;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #0000003a;
  }
  .user-profile.appear{
    visibility: visible;
    animation-name: appear;
    animation-duration: 1s;
    animation-iteration-count: 1;
  }
`;
