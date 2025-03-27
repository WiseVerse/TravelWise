import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/components/auth/login";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function LoginPage() {
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Login into TravelWise</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter className="flex flex-col text-sm">
                <span>Noch kein Account angelegt?</span>
                <Button asChild variant="link">
                    <Link href={"/auth/register"}>Registrieren</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}