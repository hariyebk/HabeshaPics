import "./globals.css"
import {Route, Routes} from "react-router-dom"
import SigninForm from "./auth/forms/SigninForm"
import { Home, Explore, Saved, EditPost, CreatePost, Profile, PostDetails, AllUsers, UpdateProfile } from "./root/pages"
import SignupForm from "./auth/forms/SignupForm"
import AuthLayout from "./auth/AuthLayout"
import RootLayout from "./root/RootLayout"
import { Toaster } from "@/components/ui/toaster"


export default function App(){
    return (
        <main className="flex h-screen">
            <Routes>
                {/* public routes */}
                <Route element= {<AuthLayout />}>
                    <Route path="/sign-in" element = {<SigninForm />} />
                    <Route path="/sign-up" element = {<SignupForm />} />
                </Route>
                {/* private routes */}
                <Route element = {<RootLayout />}>
                    <Route index element = {<Home />} />
                    <Route path="/explore" element = {<Explore />} />
                    <Route path="/saved" element =   {<Saved />} />
                    <Route path="/all-users" element = {<AllUsers />} />
                    <Route path="/create-post" element = {<CreatePost />} />
                    <Route path="/update-post/:id" element = {<EditPost />} />
                    <Route path="/posts/:id/*" element = {<PostDetails />} />
                    <Route path="/profile/:id/*" element = {<Profile />} />
                    <Route path="/update-profile/:id" element = {<UpdateProfile />} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}
