import { GrGroup } from "react-icons/gr";
import { FaInstagram } from "react-icons/fa";
import { SiGroupme } from "react-icons/si";


export default function Hero() {
    return (
        <>
        <div class="w-full h-[50%] items-center flex flex-col justify-center py-[5rem]">
            <h3 class="text-[1rem] md:text-[1.5rem] text-primary text-shadow-lg font-[nunito] font-semibold my-[0.5rem] md:my-0">MHS {(new Date()).getFullYear()}</h3>
            <h1 class="text-[2rem] md:text-[4rem] lg:text-[6rem] text-primary text-shadow-lg font-[nunito] font-bold my-[-1rem] md:text-nowrap text-center">Youth Cancer Society</h1>
            <div class="h-[1rem]"/>
            <div class="flex flex-row">
                <a class="border-transparent hover:text-white border-1 hover:border-primary rounded-full m-1 transition duration-300" href="https://app.schoology.com/group/5494094945"><GrGroup class="mx-5 size-10 text-primary"/></a>
                <a class="border-transparent hover:text-white border-1 hover:border-primary rounded-full m-1 transition duration-300"><FaInstagram class="mx-5 size-10 text-primary"/></a>
                <a class="border-transparent hover:text-white border-1 hover:border-primary rounded-full m-1 transition duration-300"><SiGroupme class="mx-5 size-10 text-primary"/></a>
            </div>
        </div>
        </>
    )
}