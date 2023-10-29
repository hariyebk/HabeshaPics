import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInValidation } from "@/lib/validation"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

function SignInForm() {
    const {toast} = useToast()
    const {mutateAsync: signInAccount} = useSignInAccount()
    const {checkAuthUser, isLoading: isUserLoading} = useUserContext()
    const navigate = useNavigate()

    // Form from react hook form 
    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
        email: '',
        password: '',
        },
    })
    // OnSubmit handler
    async function onSubmit(values: z.infer<typeof signInValidation>) {
        // creating a session and logging-in the user
        const session = await signInAccount({
            email: values.email,
            password: values.password
        })

        if(!session){
            return toast({
                title: "sign in failed. please try again"
            })
        }    
        // checks if the user is logged-in and a session is created, and then it a adds the user to the global state.
        const LoggedIn = await checkAuthUser()

        if(LoggedIn){
            form.reset()
            navigate("/")
        }
        else{
            return toast({title: "Sign-in failed. please try again"})
        
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col ">
                <img src="/assets/images/logo.svg"  className="-mb-5"/>
                <h2 className="h3-bold md:h3-bold pt-5 sm:pt-12"> Log in to your Account </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2"> Welcome back. Please enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-2 w-full">
                {/* EMAIL */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="shad-form_label">Email</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="shad-form_label">Password</FormLabel>
                        <FormControl>
                            <Input type="password" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <Button type="submit" className="shad-button_primary mt-3">
                        {isUserLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading
                            </div>
                        ): "Sign In"
                        }
                    </Button>
                    <p className="text-small-regular text-light-1 text-center mt-2">
                        Don't have an account ? 
                        <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-2"> Sign up </Link>
                    </p>
                </form>
            </div>
    </Form>
    )
}

export default SignInForm