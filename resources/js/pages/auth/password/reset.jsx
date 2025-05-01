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
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

import { useForm } from "@inertiajs/react"
import { useRoute } from "ziggy"

 

function Reset({ password_token }) {

    const route = useRoute();

    const { data, setData, post, processing, errors } = useForm({
        password: "",
        password_confirmation: "",
        password_token : password_token
    });


    function submit(e) {
        e.preventDefault();
        post(route("auth.password.toReset"));
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset</CardTitle>
                    <CardDescription>
                        Forgot your password? We got you covered !
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>


                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setData("password", e.target.value)}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Confirm your password</Label>
                                </div>
                                <Input 
                                    id="password_confirmation" 
                                    type="password" 
                                    required 
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    className={errors.password_confirmation ? "border-red-500" : ""}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                <Loader2 className="animate-spin" hidden={!processing} />
                                Reset my password
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

Reset.layout = page => {
    return <Layout children={page} />
}

export default Reset