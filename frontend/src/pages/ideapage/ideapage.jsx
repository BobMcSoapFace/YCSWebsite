import { getCookie, proxy } from "@/App";
import Navbar from "@/components/navbar/navbar";
import QA from "@/components/qa/qa";
import AlertContainer from "@/components/ui/alert";
import axios from "axios";
import { useState } from "react";

export default function IdeaPage() {
    const [title, setTitle] = useState('Cool idea');
    const [alerts, setAlerts] = useState([])
    const insertIdea = () => {
        if(getCookie("Email") === null || getCookie("Email") === ""){
            console.log("Cannot submit without logging in!")
            return
        }
        axios.post(proxy+"/data/send-idea", {
                title:title,
                sessionId:getCookie("SessionId"),
            },{
                method:"POST", 
                mode:"cors",
                headers: {
                 "Content-Type": "application/json"
                },
                
            }).then((res) => {
                if(res.data !== '' && res.data.response !== undefined){
                    setAlerts([...alerts, res.data.response])
                } else {
                    setTitle('')
                }
            })
    }
    return (<div>
        <div class="infiniteScroll fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="infiniteScroll translate-y-full fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="infiniteScroll translate-x-[-100%] fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <div class="infiniteScroll translate-y-full translate-x-[-100%] fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#d5d7db_1px,transparent_1px)] [background-size:16px_16px]"/>
        <Navbar/>
        <div class="h-75 md:h-35"/>
        <AlertContainer alerts={alerts}/>
        <div class="flex flex-col lg:flex-row w-full h-screen gap-3">
            <form class="px-6 w-full lg:w-3/8"><div class=" w-full bg-white border-primary border-1 gap-y-2
            rounded-xl lg:rounded-2xl text-white font-[nunito] flex flex-col bg-clip-content shadow-xl">
                <span class="text-3xl font-bold w-full h-full p-6 bg-primary rounded-t-xl
                lg:rounded-t-2xl">Your Idea!!!!!</span>
                <span class="text-primary p-5 font-semibold flex flex-row items-center">
                    <span class="font-bold">{getCookie("Email") === null || getCookie("Email") === "" ? "Idea (needs to log in to submit)" :  "Idea"}</span>
                    <div class="w-4"/><input maxLength={60} value={title} onChange={(e)=>{setTitle(e.target.value)}}
                    class="p-2 px-4 border-1 border-primary rounded-2xl flex-grow text-[0.85rem]"/>
                </span>
                <span class="text-white p-5 font-semibold flex flex-row-reverse items-center">
                    <span class="bg-primary p-3 px-6 border-secondary 
                    border-1 shadow-xl rounded-2xl transition-transform hover:scale-105 hover:cursor-pointer" onClick={insertIdea}>Submit</span>
                </span>
            </div></form>
            <div class="h-15"/>
            <div class="lg:w-auto flex flex-col items-left gap-y-5 px-10 lg:pl-0 lg:pr-20">
                <QA question="Why submit your idea?" 
                answer="Youth Cancer Society blah blah blah Something Something blah Ideas Votes"/>
                <QA question="Other question?" 
                answer="Youth Cancer Society blah blah blah Something Something blah Ideas Votes"/>
            </div>
        </div>
    </div>)
}