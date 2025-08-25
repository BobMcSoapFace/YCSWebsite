import { useEffect, useState } from "react";
import { TiCancel } from "react-icons/ti";
import { twMerge } from "tailwind-merge";

export function Alert({text}){
    const [open, setOpen] = useState(true)
    return open?(<div class={"w-fit h-auto rounded-2xl bg-white border-1 border-primary "+
    "shadow-2xl p-3 flex flex-row text-primary font-semibold items-center text-[1rem]"}>
        {text}<div class="ml-20 h-full aspect-square text-2xl hover:cursor-pointer" onClick={() => {setOpen(false)}}><TiCancel/></div>
    </div>):null
}
export default function AlertContainer({alerts}){
    return <div class={twMerge("fixed ml-10 w-auto h-auto items-center flex gap-y-2 flex-col z-1000")}>
        {alerts.map((alert) => {
            return <Alert text={alert}/>
        })}
    </div>
}