import Layout from "@/Layouts/auth";

import { Loader2 } from "lucide-react"

import { Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Checkbox } from "@/Components/ui/checkbox"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

import { useForm } from "@inertiajs/react"
import { useRoute } from "ziggy"



function Login({ }) {

    const route = useRoute();


    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });


    function submit(e) {
        e.preventDefault();
        post(route("auth.toLogin"));
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    required
                                    onChange={(e) => setData("email", e.target.value)}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href={route("auth.password.forget")}
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setData("password", e.target.value)}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me ?
                                </label>
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                <Loader2 className="animate-spin" hidden={!processing} />
                                Login
                            </Button>
                            {/* Forced to use <a> instead of <Link> to ensure that the proper css is loaded via vite */}
                            <a href={route('home')}>
                                <Button variant="outline" type="button" className="w-full" disabled={processing}>
                                    Back to home
                                </Button>
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

Login.layout = page => {
    return <Layout children={page} />
}

export default Login