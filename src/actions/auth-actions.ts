"use server";

import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    // Mock login logic
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Login attempt:", email);

    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Successful login redirects to dashboard
    redirect("/dashboard");
}

export async function logout() {
    // Mock logout
    redirect("/");
}
