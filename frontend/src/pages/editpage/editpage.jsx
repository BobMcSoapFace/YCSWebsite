import { getCookie, proxy } from "@/App";
import Navbar from "@/components/navbar/navbar";
import AlertContainer from "@/components/ui/alert";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdWhereToVote } from "react-icons/md";
import { FaCrown } from "react-icons/fa";

export default function EditPage(){
    const [podcast, setPodcast] = useState({
        title:'',
        url:'',
        description:'',
        author:'',
    });
    const [alerts, setAlerts] = useState([])
    const [previousWinners, setPreviousWinner] = useState([])
    const [currentWinner, setCurrentWinner] = useState({})
    const setWinners = () => {
        try {
            axios.get(proxy+"/data/winners", 
                {credentials: true,
                withCredentials: true,}
            ).then((res) => {
                if(res.data !== '' && res.data.response !== undefined){
                    setAlerts([...alerts, res.data.response])
                } else {
                    setPreviousWinner(res.data["Winners"])
                }
            })
            axios.get(proxy+"/data/ideas", 
                {credentials: true,
                withCredentials: true,}
            ).then((res) => {
                if(res.data !== '' && res.data.response !== undefined){
                    setAlerts([...alerts, res.data.response])
                } else {
                    console.log(res.data)
                    if(res.data["Ideas"].length > 0){
                        setCurrentWinner(res.data["Ideas"].sort((a, b) => {return b["Votes"] - a["Votes"]})[0])
                    }
                }
            })
              
        } catch (e) {
            setAlerts([...alerts, e])
        }
    }
    useEffect(setWinners, [])
    const postWinner = () => {
        axios.post(proxy+"/data/send-winner", 
            {
                sessionId:getCookie("SessionId")
            },
            {credentials: true,
            withCredentials: true,}
        ).then((res) => {
            if(res.data !== '' && res.data.response !== null){
                setAlerts([...alerts, res.data.response])
            } else {
                setWinners()
            }
        })
    }
    const postPodcast = () => {
        axios.post(proxy+"/data/send-podcast", 
            {
                ...podcast,
                sessionId:getCookie("SessionId")
            },
            {credentials: true,
            withCredentials: true,}
        ).then((res) => {
            if(res.data !== '' && res.data.response !== null){
                setAlerts([...alerts, res.data.response])
            } else {
                setPodcast({
                    title:'',
                    url:'',
                    description:'',
                    author:'',
                })
            }
        })
    }
    return (<div class="bg-secondary min-h-screen w-screen items-center">
        <Navbar/>
        <div class="h-71 md:h-30"/>
        <AlertContainer alerts={alerts}/>
        <div class="px-6 md:px-20 w-full items-start flex flex-col gap-y-4">
            <div class="w-3/4 h-auto p-4 flex flex-col gap-y-1.5 bg-white ml-6 shadow-2xl
            rounded-2xl border-secondary border-1 text-primary font-semibold text-xl">
                <span class="flex flex-row items-center"><MdWhereToVote className="text-2xl"/><div class="w-2"/>Voting</span>
                <div class="flex flex-row gap-x-2 divide-x-1 divide-gray-300">
                    <div class="px-4 flex flex-col gap-y-2">
                        <span class="flex flex-row gap-x-4 items-center"><FaCrown/>Previous voting results</span>
                        <div class="text-[1rem] flex flex-col divide-y-1 divide-gray-300 gap-y-2">
                            {previousWinners.length > 0 ? previousWinners.map((previousWinner) => {
                                return <span class="py-1">{previousWinner["Title"]}</span>
                            }):"No previous winner found."}
                        </div>
                    </div>
                    <div class="px-4 flex flex-col gap-y-2">
                        <span class="flex flex-row gap-x-4 items-center"><FaCrown/>Current voting results</span>
                        <div class="text-[1rem]">
                            {currentWinner != null && currentWinner["Title"] != undefined?currentWinner["Title"]:"No current winner found."}
                            {currentWinner != null && currentWinner["Title"] != undefined? 
                            (<><br/><span class="py-2 h-auto w-auto text-xs font-bold">{currentWinner["Votes"]} votes</span></>) : null}
                        </div>
                    </div>
                </div>
                <div class="w-full h-auto p-6 flex flex-row">
                        <span class="bg-primary p-3 px-6 border-secondary text-white ml-auto
                    border-1 shadow-xl rounded-2xl transition-transform hover:scale-105 hover:cursor-pointer
                    hover:text-primary hover:bg-white" onClick={postWinner}>Finalize</span>
                    </div>
            </div>
            <form class="px-6 w-full lg:w-5/8"><div class=" w-full bg-white border-primary border-1 gap-y-2
                        rounded-xl lg:rounded-2xl text-white font-[nunito] flex flex-col bg-clip-content shadow-2xl">
                <span class="text-3xl font-bold w-full h-full p-6 bg-primary rounded-t-xl
                lg:rounded-t-2xl">Podcast</span>
                <span class="text-primary p-5 font-semibold flex flex-col items-start">
                    <span class="font-bold">Title</span><div class="w-4"/><input maxLength={200} value={podcast["title"]} 
                    onChange={(e)=>{setPodcast({...podcast, title:e.target.value})}}
                    class="p-2 px-4 border-1 border-primary rounded-2xl w-full text-[0.85rem]"/>
                </span>
                <span class="text-primary p-5 font-semibold flex flex-col items-start">
                    <span class="font-bold">Author</span><div class="w-4"/><input maxLength={80} value={podcast["author"]} 
                    onChange={(e)=>{setPodcast({...podcast, author:e.target.value})}}
                    class="p-2 px-4 border-1 border-primary rounded-2xl w-1/3 text-[0.85rem]"/>
                </span>
                <span class="text-primary p-5 font-semibold flex flex-col items-start">
                    <span class="font-bold">Description</span><div class="w-4"/><input maxLength={600} value={podcast["description"]} 
                    onChange={(e)=>{setPodcast({...podcast, description:e.target.value})}}
                    class="p-2 px-4 border-1 border-primary rounded-2xl w-full text-[0.85rem]"/>
                </span>
                <span class="text-primary p-5 font-semibold flex flex-col items-start">
                    <span class="font-bold">URL</span><div class="w-4"/><input maxLength={80} value={podcast["url"]} 
                    onChange={(e)=>{setPodcast({...podcast, url:e.target.value})}}
                    class="p-2 px-4 border-1 border-primary rounded-2xl w-full text-[0.85rem]"/>
                </span>
                <span class="text-primary p-5 font-semibold items-center">
                    For URLs, use the Embed option from the Share button on Youtube, and select <span class="italic">only </span> 
                    the URL part of the embedded code (labled as src="_____", looks like https://www.youtube.com/embed/1U2CPg42_OM?si=PO9eIhxvtpxLbLsT).
                </span>
                <span class="text-white p-5 font-semibold flex flex-row-reverse items-center">
                    <span class="bg-primary p-3 px-6 border-secondary 
                    border-1 shadow-xl rounded-2xl transition-transform hover:scale-105 hover:cursor-pointer
                    hover:text-primary hover:bg-white" onClick={postPodcast}>Submit</span>
                </span>
            </div></form>
            <div class="h-20"/>
        </div>
    </div>)
}