import {AuthResponse, ErrorLoginResponse, ErrorRegisterResponse, User} from "@/lib/types";

export const Login = async (email: string, password: string) => {
    const response = await fetch("https://travelwise-api.azurewebsites.net/api/Identity/Login", {
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    const data = await response.json();

    if (isErrorLoginResponse(data)) {
        // Fehlerbehandlung hier
        return data as ErrorLoginResponse;
    }

    // Erfolgreiche Authentifizierung
    return data as AuthResponse;
}

export const Register = async (email: string, password: string, username: string) => {
    const response = await fetch("https://travelwise-api.azurewebsites.net/api/Identity/Register", {
        method: "POST",
        body: JSON.stringify({ 
            email: email, 
            password: password,
            userName: username,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await response.json();

    if (isErrorRegisterResponse(data)) {
        // Fehlerbehandlung hier
        return data as ErrorRegisterResponse;
    }

    // Erfolgreiche Authentifizierung
    return data as AuthResponse;
}

export const fetchUser = async (token: string) => {
    const response = await fetch("https://travelwise-api.azurewebsites.net/api/Identity/GetUser", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const data: User = await response.json()
    return data
}

function isErrorRegisterResponse(data: unknown): data is ErrorRegisterResponse {
    if (
        typeof data !== "object" ||
        data === null ||
        !("errors" in data)
    ) {
        return false;
    }

    const errors = (data as { errors: unknown }).errors;

    if (!Array.isArray(errors)) {
        return false;
    }

    return errors.every((error): error is { code: string; description: string } =>
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code: unknown }).code === "string" &&
        "description" in error &&
        typeof (error as { description: unknown }).description === "string"
    );
}

function isErrorLoginResponse(data: unknown): data is ErrorLoginResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
    );
}



