import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupValidation } from "@/lib/validation"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import Loader from "@/components/shared/Loader"

function SignupForm() {
    const {toast} = useToast()
    const {isPending: isCreatingUser, mutateAsync: createNewUser} = useCreateAccount()
    const { mutateAsync: signInAccount} = useSignInAccount()
    const {checkAuthUser} = useUserContext()
    const navigate = useNavigate()

    // Form from react hook form 
    const form = useForm<z.infer<typeof signupValidation>>({
        resolver: zodResolver(signupValidation),
        defaultValues: {
        name: '',
        email: '',
        username: '',
        password: '',
        },
    })
    // OnSubmit handler
    async function onSubmit(values: z.infer<typeof signupValidation>) {
        // create new user
        const newUser = await createNewUser(values)
        // If the process of creating a new user in the database failed
        if(!newUser){
        return toast({
            title: "Sign up failed. please try again",
            })
        } 
        // creating a session and logging-in the user
        const session = await signInAccount({
            email: values.email,
            password: values.password
        })

        if(!session){
            return toast({
                title: "sign in failed. please try again",
                variant: "destructive"
            })
        }    
        // checks if the user is logged-in and a session is created, and then it a adds the user to the global state.
        const LoggedIn = await checkAuthUser()

        if(LoggedIn){
            form.reset()
            navigate("/")
        }
        else{
            return toast({title: "Sign-in failed. please try again", variant: "destructive"})
        
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col ">
                <img src="/assets/images/logo.svg"  className="-mb-5"/>
                <h2 className="h3-bold md:h3-bold pt-5 sm:pt-12"> Create your Account </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2"> To use Snapgram enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-2 w-full">
                    {/* NAME */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="shad-form_label">Name</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Username */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="shad-form_label">User name</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
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
                        {isCreatingUser ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading
                            </div>
                        ): "Sign up"
                        }
                    </Button>
                    <p className="text-small-regular text-light-1 text-center mt-2">
                        Already have an account ? 
                        <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-2"> Login </Link>
                    </p>
                </form>
            </div>
    </Form>
    )
}

export default SignupForm