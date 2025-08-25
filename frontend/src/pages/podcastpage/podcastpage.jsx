import Footnote from "@/components/footnote/footnote";
import Navbar from "@/components/navbar/navbar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from "react";
import { proxy } from "@/App";

export default function PodcastPage() {
    const [podcasts, setPodcasts] = useState([])
    useEffect(() => {
        fetch(proxy+"/data/pods", {
                method:"GET", 
                mode:"cors",
                headers: {
                 "Content-Type": "application/json"
                },
                credentials: "include",
            }).then((res) => {
                res.json().then((res, err) => {
                    console.log(res)
                    if(err){
                        console.error("JSON resource error")
                        return
                    }
                    setPodcasts([...(res["Podcasts"])])
                });
        })
    }, [])
    return (<div class="flex flex-col items-center">
        <div class="ypulse fixed h-full w-full bg-white"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div></div>
        <Navbar/>
        <div class="h-80 md:h-50"/>
        <Carousel className="w-full max-w-3/4 md:max-w-1/2 items-center justify-center" opts={{loop:true, align:"center"}}>
                <CarouselContent>
                    {podcasts.sort((a, b) => {return a["Date"] > b["Date"] ? -1 : 1}).map((pod, _) => (
                        <CarouselItem key={pod["Date"]} className="flex w-auto">
                            <div className="p-1 w-full ">
                            <iframe src={pod["Url"]} title="YouTube video player" 
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                            class="w-full aspect-video rounded-xl"></iframe>
                            <div class="h-6"/>
                            <div class="h-auto shadow-xl w-full bg-white border-gray-300 border-1 
                            p-4 flex flex-col text-primary rounded-xl transition-transform hover:translate-y-[-0.2rem]">
                                <span class="text-2xl font-semibold">{pod["Title"]}</span>
                                <span>{pod["Description"]}</span>
                                <div class="h-2"/>
                                <span class="text-xs font-semibold">{(new Date(pod["Date"])).toDateString()}</span>
                                <div class="h-2"/>
                            </div>
                            <div class="h-8"/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="" />
                <CarouselNext />
            </Carousel>
        <div class="h-40"/>
    </div>)
}