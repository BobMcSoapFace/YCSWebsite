import { MdHowToVote } from "react-icons/md";
import { FaPodcast } from "react-icons/fa";
import { BsLightbulbFill } from "react-icons/bs";


const stuff = [{name:"Ideas", href:"/idea", desc:"Submit your ideas for what we should do in the future!", icon:(<MdHowToVote/>)},
                {name:"Podcasts", href:"/pods", desc:"Listen to our club's own podcasts", icon:(<FaPodcast/>)},
            {name:"Vote", href:"/votes", desc:"Vote on other people's ideas!", icon:(<BsLightbulbFill/>)}]
export default function MoreBar() {
    return (
        <>
        <div class="w-full h-auto p-10 md:p-20 divide-gray-300 divide-y-1">
                <div class="w-full h-full bg-white rounded-3xl border-gray-300 border-1 flex flex-col">
                    <header class="w-full h-12 p-5 text-primary font-[nunito] font-semibold text-[1rem] md:text-[1.4rem]">
                        Check out our other stuff!
                    </header>
                    <div class="w-full h-full p-8 flex flex-col md:flex-row divide-x-0 divide-y-1 md:divide-y-0 md:divide-x-1 divide-gray-300 gap-y-4 md:gap-y-0">
                        {stuff.map((obj, _) => {
                            return <div class={"md:w-1/" + stuff.length +  " h-full px-[0.2rem] md:px-3 items-center text-xl md:text-2xl font-bold font-[nunito] text-primary pb-8 md:pb-0"
                            }>
                                <div class="flex flex-row">{obj["name"]}<div class="w-1/48"/>{obj["icon"]}</div>
                                <a class="text-[0.7rem] md:text-[1.05rem] underline" href={obj["href"]}>{obj["desc"]}</a>
                            </div>
                        })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}