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


 

function Forget({ }) {

    const route = useRoute();

    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });


    function submit(e) {
        e.preventDefault();
        post(route("auth.password.toForget"));
    }
    
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forget</CardTitle>
                    <CardDescription>
                        If you forgot your password, you can reset it here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>

                        <div className="grid gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    onChange={(e) => setData("email", e.target.value)}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                            </div>
                            <Button type="submit" className="w-full mt-2" disabled={processing}>
                                <Loader2 className="animate-spin" hidden={!processing} />
                                Send password reset link
                            </Button>
                            {/* Forced to use <a> instead of <Link> to ensure that the proper css is loaded via vite */}
                            <Link href={route('auth.login')}>
                                <Button variant="outline" type="button" className="w-full" disabled={processing}>
                                    Back to login
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

Forget.layout = page => {
    return <Layout children={page} />
}

export default Forget