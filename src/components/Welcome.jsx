import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { useDataLayer } from "../datalayer";
export default function Welcome() {
  const [data, dispatch] = useDataLayer();
  const [userName, setUserName] = useState("");
  // const check = () => {
  //   console.log(data);
  //   dispatch({type: "CHECK"});
  //   console.log(data);
  // }
  useEffect(async () => {
    setUserName(
      data.username
    );
  }, []);
  // useEffect(() => {
  //   console.log("ITs working")
  // }, [data.username])
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
