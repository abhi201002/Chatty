import React from 'react'
import styled from "styled-components";

function Info() {
  return (
    <Container>
        <div className="info">
            <div className="info_desc">
                <div className="first">Name</div>
                <div className="second">abhishek</div>
            </div>
            <div className="info_desc">
                <div className="first">Phone</div>
                <div className="second">+91 7568630488</div>
            </div>
        </div>
        <div className="buttons">
            <button className="button_option block">
                Block
            </button>
            <button className="button_option">
                Unfriend
            </button>
        </div>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    border: 0.5px solid yellow;
    top: 100px;
    left: 405px;
    height: 200px;
    width: 150px;
    background-color: #080420;
    padding: 10px 10px;
    .first{
        font-size: 13px;
        color: grey;
    }
    .second{
        color: white;
    }
    .info_desc{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 7px;
        margin-bottom: 10px;
    }
    .buttons{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .button_option{
        background-color: transparent;
        border: none;
        color: white;
    }
    .block{
        color: red;
    }
`

export default Info