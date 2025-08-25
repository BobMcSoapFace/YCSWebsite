import { useState, cloneElement } from 'react'
import { Link } from 'react-router';
import logo from "./ycs_logo_mono.png"
import {FaHome,FaArchive, } from "react-icons/fa"
import { FaPodcast } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import SignInButton from '../signin/signin';
import { BiSolidPencil } from "react-icons/bi";
import { getCookie } from '@/App';

const routes = [
    {
        "route":"/",
        "name":"HOME",
        "icon":(<FaHome/>),
    },
    {
        "route":"/votes",
        "name":"VOTES",
        "icon":(<FaArchive/>)
    },
    {
        "route":"/pods",
        "name":"PODCAST",
        "icon":(<FaPodcast/>)
    },
    {
        "route":"/members",
        "name":"MEMBERS",
        "icon":(<VscAccount/>)
    },
    {
        "route":"/edit",
        "name":"EDIT",
        "icon":(<BiSolidPencil/>)
    },
];
export default function Navbar(){
    
    return (
        <>
        <div class="fixed flex md:flex-row p-5 md:h-24 bg-primary items-start md:items-center w-full flex-col h-auto z-10 navbar" id="navbar">
            <img class="aspect-square size-12" src={logo}></img>
            <div class="w-2"/>
            <div class="m-1 text-4xl font-bold text-shadow-lg mx-2 text-white">YCS</div>
            <div class="w-20"/>
            <div class="flex flex-row mt-5 md:mt-0">
                {routes.map((route) => {
                    return !(route["route"] === "/edit" && getCookie("Admin") !== "true") ? (<Link to={route["route"]} class="flex-row place-items-center mx-2 md:mx-6 md:my-0 flex px-4 py-2 rounded-md border hover:border-white
                    border-secondary bg-white text-secondary text-sm shadow-[4px_4px_0px_0px] hover:bg-secondary hover:text-white transition-colors">
                    {cloneElement(route["icon"], {class: route["icon"].props.class + " size-6 "})}
                    <div class="m-1 md:text-[1.4rem] font-bold text-shadow-xs md:mx-4 text-xl w-auto">
                    <span class="hidden lg:block">{route["name"]}</span> 
                    </div>
                    </Link>) : (<></>)
                })}
            </div>
            <SignInButton/>
        </div>
        </>
    )
}