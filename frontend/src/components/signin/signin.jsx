import { FaGoogle } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { getCookie, proxy } from "@/App"
import axios from 'axios';
import { useState } from "react"
import { twMerge } from "tailwind-merge"


export default function SignInButton({className}) {
    const handleSuccess = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
        axios.post(proxy+"/data/auth/callback",
            {code: credentialResponse},
            {credentials: true,
            withCredentials: true,}
        ).then((res) => {
            window.location.reload()
        })
        }, flow:'auth-code'});


    const handleError = () => {
        console.error('Login Failed')
    }
    return (
        <div onError={handleError} auto_select={true} flow='auth-code'
         className={cn("ml-0 p-3.5 xl:px-4 xl:py-2 rounded-md border border-secondary bg-white text-secondary text-xl xl:text-sm shadow-[4px_4px_0px_0px]",
                    "flex-row flex items-center md:ml-auto mt-5 md:mt-0 hover:cursor-pointer font-semibold hover:bg-secondary hover:text-white",
                    "transition-colors ", className)}
                    onClick={() => {
                        if((getCookie("Email") == null || getCookie("Email") === "") || true){
                            handleSuccess()
                        } else {
                            console.log("Already logged in")
                        }
                    }} data-onsuccess="onSignIn"><FaGoogle/>
                    <div class="w-5 hidden xl:block"/><span class="hidden xl:block">
                        {getCookie("Email") == null || getCookie("Email") === "" ? "Sign in" : getCookie("Email")}
                        </span></div>
    )
}