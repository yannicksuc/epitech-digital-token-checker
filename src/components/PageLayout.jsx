/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import Navbar from "react-bootstrap/Navbar";

import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import {Image} from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const [user, loading, error] = useAuthState(getAuth());
    function isAuthenticated() {
        console.log(user);
        return false;
    }

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Image className="logo-image" fluid={true} src={'/EPITECH-LOGO-DIGITAL-BLANC-2021.png'}></Image>
                <a className="navbar-brand d-none d-sm-block" href="/" >Epitech Token Validator</a>
                { isAuthenticated ? <SignOutButton /> : null }
            </Navbar>
            <div className="flex-column h-100 main-content">
                {props.children}
            </div>
            <img src={process.env.FIREBASE_PUBLIC_URL + '/presence-token-validator-logo.svg'} alt={"logo"} className="background-image"></img>
        </>
    );
};
