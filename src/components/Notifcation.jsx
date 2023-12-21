import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Cross from "../assets/cross.svg";
import Cross1 from "../assets/cross1.svg";
import Accept from "../assets/accept.svg";
import axios from 'axios';
import { friendRequest } from '../utils/APIRoutes';
import { useDataLayer } from '../datalayer';

function Notifcation({changenotify}) {
    const [request, setRequest] = useState([]);
    const [data, dispatch] = useDataLayer();
    const cur_user = data._id;
    const handleNotification = async () => {
        const result = await axios.get(`${friendRequest}/getRequest/${cur_user}`);

        setRequest(result.data)
    }
    const handleRequest = async (user, value) => {
        const result = await axios.post(`${friendRequest}/${value}friends/${cur_user}/${user}`)
        handleNotification();
    }
    useEffect(() => {
        handleNotification();
    },[])
  return (
    <Notify>
        <div className="notification">
            NOTIFICATION
            <div>
            <img src={Cross1} alt="" onClick={() => {changenotify()}}/>
            </div>
        </div>
        <div className="request-item">
            {
                request.length !==0 ?
                request?.map((Item) => {
                    return(
                        <Request>
                            <div className="info">
                                {/* <img src="https://i.seadn.io/gae/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc?auto=format&dpr=1&w=1000" alt="" /> */}
                                <img
                                    src={`data:image/svg+xml;base64,${Item.avatarImage}`}
                                    alt=""
                                />
                                <div>{Item.username}</div>
                            </div>
                            <div className="selection">
                                {/* <button className="accept"> */}
                                <div>
                                    <img src={Accept} alt="" onClick={() => {handleRequest(Item?._id, "accept")}} />
                                </div>
                                {/* </button> */}
                                {/* <button className="reject"> */}
                                <div>
                                    <img src={Cross} alt="" onClick={() => {handleRequest(Item?._id, "reject")}}/>
                                </div>
                                {/* </button> */}
                            </div>
                        </Request>
                    )
                })
                :
                <div className="message"> No Notification! </div>
            }
        </div>
    </Notify>
  )
}

const Notify = styled.div`
    height: 100%;
    .notification{
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
    }
    .notification img{
        height: 15px;
        color: white;
        cursor: pointer;
    }
    .notification div :hover{
        transform: scale(1.2);
        transition: transform 200ms;
    }
    .request-item{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
    }
    .message{
        color: white;
        height: 100%;
        text-align: center;
    }
`

const Request = styled.div`
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: white;
    /* border: 1px solid red; */
    padding: 10px 10px;

    .info, .selection{
        /* border: 2px solid green; */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
    .info div{
        font-size: 20px;
    }
    .info img{
        height: 3rem;
        border-radius: 50%;
    }
    .selection button {
        border: none;
        height: 100%;
    }
    .selection img{
        cursor: pointer;
    }
    .selection div :hover{
        transform: scale(1.2);
        transition: transform 200ms;
    }
`
export default Notifcation