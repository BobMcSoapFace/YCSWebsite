import Navbar from "@/components/navbar/navbar"
import { FaCrown } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getCookie, proxy } from "@/App";
import axios from "axios";
import AlertContainer from "@/components/ui/alert";

export default function VotePage() {
    const [ideas, setIdeas] = useState([])
    const [alerts, setAlerts] = useState([]) 
    const getIdeas = () => {
    fetch(proxy+"/data/ideas", {
        method:"GET", 
        mode:"cors",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
    }).then((res) => {
        res.json().then((res, err) => {
            if(err){
                console.error("JSON resource error")
                return
            }
            setIdeas([...(res["Ideas"])])
    })})}
    useEffect(() => {
        getIdeas()
    }, [])
    return (<div>
        
        <div class="infiniteScroll fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="infiniteScroll translate-y-full fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="infiniteScroll translate-x-[-100%] fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="infiniteScroll translate-y-full translate-x-[-100%] fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="w-screen justify-items-end px-5">
            <Link to="/idea" class="group absolute top-75 md:top-45 bg-primary w-40 h-15 shadow-xl 
            rounded-2xl text-white flex flex-row items-center font-[nunito] z-100
            transition-transform hover:scale-104 hover:translate-x-[-0.4rem] hover:cursor-pointer
            hover:bg-white hover:text-primary hover:border-1 hover:border-gray-300 p-4 text-2xl font-extrabold">
                <FaPlus class="text-xl font-bold"/><div class="w-3"/>New
            </Link>
        </div>
        <Navbar/>
        <div class="h-70 md:h-30"/>
        <AlertContainer alerts={alerts}/>
        <div class="text-4xl md:text-6xl p-3 md:px-10 font-extrabold font-[nunito] text-white text-shadow-primary drop-shadow-[0_1.2px_1.2px_var(--color-primary)]">
            Ideas
        </div>
        <div class="h-8"/>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10 p-3 md:p-8 ">
            {ideas.sort((a, b) => {return b["Votes"] - a["Votes"]}).map((obj, index) => {
                return <div class="w-full h-auto p-4 md:p-8 bg-white border-primary border-1 rounded-2xl drop-shadow-xl
                hover:scale-102 transition-all">
                    <span class="text-3xl md:text-3xl text-primary font-bold flex flex-row">
                        <span className={
                            twMerge(
                                "items-center",
                                index == 0 && "flex",
                                index != 0 && "hidden"
                            )
                        }><FaCrown/><div class="w-4"/></span>
                        {obj["Title"]}
                    </span>
                    <div class="h-3"/>
                    <span class="text-xl md:text-xl text-primary flex flex-row items-center">
                        <span class="font-extrabold">{obj["Votes"]}</span><div class="w-2"/>
                        <span class="font-semibold">votes</span>
                        <div class="ml-auto w-auto px-6 py-2 font-semibold bg-primary text-white rounded-2xl 
                        shadow-xl hover:scale-105 transition-all hover:cursor-pointer
                        hover:bg-white hover:text-primary hover:border-1 hover:border-gray-300" onClick={
                            () => {
                                if(getCookie("Email") === undefined || getCookie("Email") === ""){
                                    console.log("Cannot vote without logging in!")
                                    return
                                }
                                axios.post(proxy+"/data/vote-idea", {
                                    sessionId:getCookie("SessionId"),
                                    IdeaId:obj["Id"]
                                }, {
                                    method:"POST", 
                                    mode:"cors",
                                    headers: {
                                    "Content-Type": "application/json"
                                    },
                                }).then((res) => {
                                    if(res.data.response !== undefined && res.data.response !== "" && res.data !== ""){
                                        setAlerts([...alerts, res.data.response])
                                    }
                                    getIdeas()
                                })
                            }
                        }>Vote</div>
                    </span>
                    <span class="text-xs md:text-xs text-primary flex flex-row items-center font-semibold">
                        {(new Date(obj["Date"])).toDateString()}
                    </span>
                    
                </div>
            })}
            <div class="h-40"/>
        </div>
    </div>)
}