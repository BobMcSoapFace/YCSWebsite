
import { IoCalendarSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";

export default function Infobar() {
    return (<>
        <div class="w-4/5 md:w-11/16 lg:w-9/16 h-40 md:h-20 rounded-2xl md:rounded-full flex flex-col divide-y-1 lg:divide-y-0 lg:flex-row lg:divide-x-1 divide-primary border-secondary bg-white border-1 
        p-2 lg:p-4 items-center justify-center text-primary text-[90%] md:text-[1.3rem] shadow-[4px_4px_0px_0px] font-semibold">
            <div class="text-left mmin-w-1/5 px-8 flex flex-row items-center py-4 md:py-0">
                <IoCalendarSharp/><div class="w-6"/>September 5th - First meeting
            </div>
            <div class="text-right min-w-1/5 px-8 flex flex-row items-center py-4 md:py-0">
                <FaRegClock/><div class="w-6"/>Every other Friday
            </div>
        </div>
    </>);
}