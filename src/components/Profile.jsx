import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Cross1 from "../assets/cross1.svg";
import axios from 'axios';
import { updateRoutes } from '../utils/APIRoutes';
import { useDataLayer } from '../datalayer';

function Profile({profile, handleProfile}) {
    const [data, dispatch] = useDataLayer();
    const [status, setStatus] = useState(false);
    const [values, setValues] = useState({
        username: "",
        old_password: "",
        new_password: "",
        confirm_password: "",
        email: "",
    });
    const [mess, setMess] = useState({
        username: "",
        password: "",
        email: ""
    })
    const handleSubmit = async(e, value) =>{
        e.preventDefault();
        const info = {
            username: values.username,
            password: values.new_password,
            email: values.email
        }
        console.log(info.email);
        let res;
        if(value == "password") res = await axios.put(`${updateRoutes}${value}/${data._id}`, {new_password: info[value], old_password: values.old_password});
        else res = await axios.put(`${updateRoutes}${value}/${data._id}`, {[value]: info[value]});
        
        if(value === "username" && res.data.status){
            dispatch({type: "UPDATE_USER", username: values.username});
            const new_data = JSON.parse(localStorage.getItem('User'));
            new_data.username = values.username;
            localStorage.setItem('User', JSON.stringify(new_data));
        }

        setStatus(res.data.status);
        setMess({
            ...mess, [value]: res.data.msg
        })
        setTimeout(() => {
            setMess({
                ...mess, [value]: ""
            })
        }, 4500)
        // }
    };
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
        console.log(values)
    };
  return (
    <Container profile = {profile}>
        <div className={`profile-container ${profile ? "appear": ""}`}>
            <div className="profile-header">
                Edit Profile
                <div>
                    <img src={Cross1} alt="" onClick={() => {handleProfile()}}/>
                </div>
            </div>
            <div className="profile">
                <form action = "" className="profile-info" onSubmit = {(e) => handleSubmit(e, "username")}>
                    <div className="profile-input">
                        <div className="info-name">Username:</div>
                        <div className="info-input">
                            <input type="text" name='username' onChange = {(e) => {handleChange(e)}} value={values.username}/>
                        </div>
                    </div>
                    <div className={`profile-update ${mess.username ? status? "success" : "fail" : ""}`}>
                        <button type='submit' disabled = {values.username == ''}>
                            {
                                mess.username?
                                mess.username:
                                "Update"
                            }
                        </button>
                    </div>
                </form>
                <hr />
                <form action = "" className="profile-info" onSubmit = {(e) => handleSubmit(e, "password")}>
                    <div className="profile-input">
                        <div className="info-name">Old Password:</div>
                        <div className="info-input">
                            <input type="password" name='old_password' onChange = {(e) => {handleChange(e)}} value = {values.old_password}/>
                        </div>
                    </div>
                    <div className="profile-input">
                        <div className="info-name">New Password:</div>
                        <div className="info-input">
                            <input type="password" name='new_password' onChange = {(e) => {handleChange(e)}} value = {values.new_password}/>
                        </div>
                    </div>
                    <div className="profile-input">
                        <div className="info-name">Confirm Password:</div>
                        <div className="info-input">
                            <input type="password" name='confirm_password' onChange = {(e) => {handleChange(e)}} value = {values.confirm_password}/>
                        </div>
                    </div>
                    <div className={`profile-update ${mess.password ? (status? "success" : "fail") : ""}`}>
                        <button
                            type='submit'
                            disabled = {
                                values.new_password == '' || values.old_password == '' || values.confirm_password == '' ||
                                values.confirm_password != values.new_password
                            }
                        >
                            {
                                mess.password?
                                mess.password:
                                "Update"
                            }
                        </button>
                    </div>
                </form>
                <hr />
                <form action = "" className="profile-info" onSubmit = {(e) => handleSubmit(e, "email")}>
                    <div className="profile-input">
                        <div className="info-name">Email Id:</div>
                        <div className="info-input">
                            <input type="text" name='email' onChange = {(e) => {handleChange(e)}} value = {values.email}/>
                        </div>
                    </div>
                    <div className={`profile-update ${mess.email ? (status? "success" : "fail") : ""}`}>
                        <button type='submit' disabled = {values.email == ''}>
                            {
                                mess.email?
                                mess.email:
                                "Update"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Container>
  )
}
// C:\Users\pgupt\Documents\Chat-App
const Container = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: ${props => (props.profile ? "#0000003a":"transparent")};
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: #0000003a; */
    .profile-container{
        visibility: hidden;
        background-color: rgb(8, 4, 32);
        height: 60vh;
        width: 40vw;
        display: flex;
        flex-direction: column;
        .profile{
            /* height: 303px; */
            overflow: scroll;
            ::-webkit-scrollbar {
                display: none;
            }
        }
        .profile-header{
            color: white;
            /* border: 2px solid red; */
            height: 50px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            background-color: #80808074;
            padding: 0px 10px;
            img{
                cursor: pointer;
                transition: 0.25s ease-in-out;
                :hover{
                    transform: scale(1.1);
                }
            }
        }
        .profile-info{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            /* align-items: center; */
            text-align: center;
            /* border: 2px solid red; */
            gap: 10px;
            padding: 5px 10px;
            .profile-input{
                color: white;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                font-size: 15px;
                .info-input{
                    input{
                        padding: 5px 10px;
                        font-size: 15px;
                        border: none;
                        background-color: #4848db83;
                        border-radius: 5px;
                        color: white;
                        :focus{
                            outline: none;
                        }
                    }
                }
            }
            .profile-update{
                width: 100%;
                text-align: center;
                button{
                    /* background-color: red; */
                    /* width: 100%; */
                    /* width: fit-content; */
                    border: none;
                    border-radius: 2.5px;
                    transform: scale(1);
                    transition: all 0.5s ease-in-out;
                    cursor: pointer;
                    padding: 5px 20px;
                }
            }
            .profile-update.success{
                button{
                    /* width: fit-content; */
                    transform: scale(1);
                    transition: all 0.5s ease-in-out;
                    background-color: #00d100;
                }
            }
            .profile-update.fail{
                button{
                    transform: scale(1);
                    /* width: fit-content; */
                    transition: all 0.5s ease-in-out;
                    background-color: red;
                    animation-name: error;
                    animation-duration: 200ms;
                    animation-iteration-count: 5;
                    animation-timing-function: linear;
                }
                @keyframes error {
                    0%{
                        transform: translateX(0);
                    }
                    25%{
                        transform: translateX(4%);
                    }
                    50%{
                        transform: translateX(0);
                    }
                    75%{
                        transform: translateX(-4%);
                    }
                    100%{
                        transform: translateX(0);
                    }
                }
            }
        }
    }
    .profile-container.appear{
        visibility: visible;
        animation-name: appear;
        animation-duration: 0.75s;
        animation-iteration-count: 1;
    }
    @keyframes appear {
        0%{
            transform: scale(0.5);
        }
        20%{
            transform: scale(1.1);
        }
        40%{
            transform: scale(0.95);
        }
        60%{
            transform: scale(1.03);
        }
        80%{
            transform: scale(0.98);
        }
        100%{
            transform: scale(1);
        }
    }
`

export default Profile