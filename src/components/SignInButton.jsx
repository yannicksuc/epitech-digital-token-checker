import React from "react";
import {Button} from "react-bootstrap";
import { getAuth, signInWithPopup, OAuthProvider } from "firebase/auth";
import {microsoftProvider} from "../firebase";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
    const auth = getAuth();


    const handleLogin = () => {
        signInWithPopup(auth, microsoftProvider)
            .then((result) => {
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
            })
            .catch((error) => {
                console.log(error)
            });
    }
    return (
        <Button variant="secondary" className="ml-auto btn-office" drop="left" title="Sign In" onClick={() => handleLogin()}> Connect using office 365</Button>
    )
}