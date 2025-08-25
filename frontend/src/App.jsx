import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './pages/homepage/homepage'
import VotePage from './pages/votepage/votepage';
import PodcastPage from './pages/podcastpage/podcastpage';
import IdeaPage from './pages/ideapage/ideapage';
import MemberPage from './pages/memberpage/memberpage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Cookies from 'js-cookie';
import EditPage from './pages/editpage/editpage';

export function getCookie(key) {
  try {
    return Cookies.get(key)
  } catch(e) {
    return null
  }
}
export const proxy = "http://localhost:60001"; // production: change to https://mason.ycsclub.club
export default function App() {
  return (
    
    <GoogleOAuthProvider clientId={"390638993443-0l72dt0rgl5clo81uf78k93t8e0h3832.apps.googleusercontent.com"}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/votes" element={<VotePage/>}/>
        <Route path="/pods" element={<PodcastPage/>}/>
        <Route path="/idea" element={<IdeaPage/>}/>
        <Route path="/members" element={<MemberPage/>}/>
        <Route path="/edit" element={<EditPage/>}/>
      </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
