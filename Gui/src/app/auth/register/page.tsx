import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import RegisterForm from "@/components/auth/register";

export default function RegisterPage() {
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle className="text-xl">Register</CardTitle>
                <CardDescription>Register into TravelWise</CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
            <CardFooter className="flex flex-col text-sm">
                <span>Schon Registriert?</span>
                <Button asChild variant="link">
                    <Link href={"/auth/login"}>Login</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}