import { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar'
import Hero from '../../components/hero/hero'
import Footnote from '../../components/footnote/footnote';
import { gsap } from 'gsap';
import Infobar from '../../components/infobar/infobar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import MoreBar from '@/components/morebar/morebar';

export default function Homepage(){
    let today = new Date();
    
    return(<div>
        <div class="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_80%)]"></div>
        <Navbar/>
        <div id="smooth-wrapper"><div class="flex flex-col items-center scroll-smooth" id="smooth-content">
        
            <div class="h-60 md:h-30 w-full"/>
            <Hero/>
            <Infobar/>
            <div class="h-20 md:h-10 w-full"/>
            <Carousel className="w-full max-w-sm" opts={{loop:true, align:"center"}}
                >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="block">
                            <div className="p-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500" 
                            class="rounded-3xl w-full h-full border-1 border-gray-300"/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="" />
                <CarouselNext />
            </Carousel>
            <div class="h-20 md:h-12 w-full"/>
            <div class="fadeInScroll p-10 md:p-20 w-full flex flex-col lg:flex-row h-auto gap-y-10">
                <div class="w-full lg:w-1/2 p-8 rounded-md border border-secondary bg-white text-secondary 
                text-[0.8rem] md:text-xl shadow-[4px_4px_0px_0px] font-semibold h-fit mb-8 md:mb-0 h-auto">
                    {today.getMonth()}/{today.getDay()} - {today.getFullYear()}<br/><br/>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
                <div class="w-24"/>
                <div class="relative ml-24">
                    <img src="https://t4.ftcdn.net/jpg/03/54/00/91/360_F_354009182_Cc6DzlgU402u1bXAGyvXAbmp5EgYAV9D.jpg"
                    class="rounded-md z-2 border-1 border-gray-400 relative shadow-2xl w-full h-auto "/>
                </div>
            </div>
            <div class="fadeInScroll p-10 md:p-20 w-full flex flex-col lg:flex-row h-auto gap-y-10">
                <img src="https://media.istockphoto.com/id/1443245439/photo/business-meeting-businesswoman-woman-office-portrait-job-career-happy-businessman-teamwork.jpg?s=612x612&w=0&k=20&c=1ZR02c1UKfGdBCNWzzKlrwrVZuEiOqnAKcKF4V_t038="
                    class="rounded-md z-2 border-1 border-gray-400 relative shadow-2xl w-auto aspect-auto"/>
                <div class="w-24"/>
                <div class="relative">
                    <div class="w-full p-8 rounded-md border border-secondary bg-white text-secondary 
                        text-[0.8rem] md:text-xl shadow-[4px_4px_0px_0px] font-semibold h-fit mb-8 md:mb-0">
                    {today.getMonth()}/{today.getDay() - 2} - {today.getFullYear()}<br/><br/>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
                </div>
            </div>
            <div class="h-26 md:h-18"/>
            <MoreBar/>
            <div class="h-[10rem]"/>
            <Footnote/>
        </div></div>
        </div>)
}