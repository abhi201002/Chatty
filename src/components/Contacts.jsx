import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useDataLayer } from "../datalayer";
import Search from "./Search";
import Notifcation from "./Notifcation";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [search, setSearch] = useState(false)
  const [notification, setNotification] = useState(false)
  const [data, dispatch] = useDataLayer();
  useEffect(async () => {
    // const data = await JSON.parse(
    //   localStorage.getItem("User")
    // );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  const changenotify = () => {
    setNotification(!notification);
  }
  const handleSearch = (cond1) => {
    if(!cond1){
      return (<div className="contacts">
                {contacts.map((contact, index) => {
                    return (
                    <div
                        key={contact._id}
                        className={`contact ${
                        index === currentSelected ? "selected" : ""
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
            </div>)
    }
    else{
        return (<Search/>)
    }
  }
  return (
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chatty</h3>
          </div>
          <div className="notify">
            {!notification?
              (<>
                <div className="friends">
                  <button className={`toggle ${!search? "active":""}`} onClick={() => {setSearch(false)}}>Friends</button>
                  <button className={`toggle ${search? "active":""}`} onClick={() => {setSearch(true)}}>Search</button>
                </div>
                <div className="side">
                {
                  handleSearch(search)
                }
                </div>
              </>)
              :
              <Notifcation changenotify = {changenotify}/>
            }
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                onClick={() => {changenotify()}}
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    flex: 15%;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    /* border: 2px solid red; */
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .notify{
    height: 100%;
  }
  .friends{
    display: flex;
    justify-content: center;
  }
  .friends button{
    cursor: pointer;
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
    /* flex: 70%; */
    height: 100%;
    /* border: 2px solid purple; */
  }
  .contacts {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
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
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    flex: 15%;
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
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
`;
