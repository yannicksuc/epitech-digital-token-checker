import React from "react";
import Button from "react-bootstrap/Button";
import { getAuth, signOut } from "firebase/auth";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {

    const handleLogout = (logoutType) => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            console.log(error)
        });
    }
    return (
        <Button variant="secondary" className="ml-auto" drop="left" title="sign Out " onClick={() => handleLogout()}>Sign Out</Button>
    )
}