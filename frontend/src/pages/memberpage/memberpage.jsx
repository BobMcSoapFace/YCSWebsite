import Navbar from "@/components/navbar/navbar";
import { twMerge } from "tailwind-merge";
import { FaCrown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { proxy } from "@/App";

export default function MemberPage(){
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch(proxy+"/data/users", {
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
                    setUsers([...(res["Users"])])
                });
        })
    }, [])
    return (<div class="bg-secondary min-h-screen w-screen items-center">
        <Navbar/>
        <div class="h-71 md:h-30"/>
        <div class="px-20 w-full items-center flex flex-col ">
            <div className="bg-primary p-4 min-w-80 sm:min-w-100 w-auto min-h-[80vh] rounded-4xl 
            shadow-2xl flex flex-col gap-y-1 divide-y-1 divide-secondary">
                {users.map((member, _ ) => {
                    return <div class="w-full h-auto p-3 flex flex-row pb-5 items-center group">
                        <img src={member["Image"] || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500"} 
                        class="w-13 aspect-square rounded-full border-2 border-gray-300 group-hover:scale-105"/>
                        <div class="w-4"/>
                        <div class={twMerge("text-white flex flex-row p-2", member["Admin"] && "block", !member["Admin"] && "hidden")}>
                            <FaCrown/>
                        </div>
                        <div class="text-white font-extrabold font-[nunito] text-[0.65rem] 
                        group-hover:text-[0.7rem] md:group-hover:text-[1.15rem] md:text-[1.1rem]">
                            {member["Email"]}
                        </div>
                    </div>
                })}
                <div class="h-25 w-full py-5 px-2 text-md text-white font-semibold">
                    <span class="flex flex-row items-center">
                        Total members <div class="w-2"/><span class="font-extrabold">{users.length}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="h-20"/>
    </div>)
}