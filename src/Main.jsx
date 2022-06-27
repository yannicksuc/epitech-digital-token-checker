import React, {useContext, useState} from "react";
import { PageLayout } from "./components/PageLayout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./styles/App.css";
import {SignInButton} from "./components/SignInButton";
import { db } from './firebase.js';
import {getAuth} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import { setDoc, getDoc, doc } from "firebase/firestore";


/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const [graphData, setGraphData] = useState(null);
    const [validated, setValidated] = useState(false);
    const [holder, setHolder] = useState([]); // update
    const auth = getAuth();
    const [user, loading, error] = useAuthState(getAuth());
    const [incorrectTokenMessage, setIncorrectTokenMessage] = useState("");
    const [correctTokenMessage, setCorrectTokenMessage] = useState("");


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        const token = event.target[0].value;

        if (form.checkValidity() && checkToken(token)) {
            //sendToken(token, accounts[0].username, new Date().toISOString());
            event.preventDefault();
            event.stopPropagation();
            const [courseid, tokenid] = token.split("_");
            const courseRef = doc(db, "courses", courseid)
            const docSnap = await getDoc(courseRef);
            if (docSnap.exists()) {
                if (docSnap.data()?.tokens?.[tokenid]) {
                    setValidated(false);
                    setIncorrectTokenMessage("Token already used")
                    return;
                } else if (Object.values(docSnap.data()?.tokens).includes(user.email)) {
                    setValidated(false);
                    setIncorrectTokenMessage("You already sent a token for this session")
                    return;
                }
            } else {
                const creationDate = new Date().toLocaleString('fr-FR', { timeZone: 'UTC' })
                setDoc(courseRef, {"creationDate": creationDate},{})
                    .then(r => {})
                    .catch(e => {
                        setValidated(false);
                        console.log("Transaction failed: ", e)
                        setCorrectTokenMessage("Transaction failed, contact your pedago for assistance")
                    })
            }
            //const creationDate = new Date(doc.createTime._seconds * 1000)
            setDoc(courseRef, {tokens: {[tokenid]: user.email}, "courseid": courseid}, {merge: true})
                .then(r => {
                    setCorrectTokenMessage("Token successfully sent! 🙌");
                    setValidated(true);
                })
                .catch(e => {
                    setValidated(false);
                    console.log("Transaction failed: ", e)
                    setCorrectTokenMessage("Transaction failed, contact your pedago for assistance")
                })
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(false);
            setIncorrectTokenMessage("Incorrect token format")
        }
    };

    const handleChange = (event) => {
        const input = event.currentTarget;
        setValidated(checkToken(input.value));
        event.preventDefault();
        event.stopPropagation();
        setIncorrectTokenMessage("Incorrect token format")
        setCorrectTokenMessage("")
    };

    function checkToken(token) {
        var tokenSplit = token.split("_");
        var activityID = tokenSplit[0];
        var tokenMid = tokenSplit[1];
        var key = activityID * activityID;

        for (let index = 0; index < 250; index++) {
            var middleSquareNumber = getNextMidnumber(key);

            if (tokenMid === middleSquareNumber) {
                return true;
            }
            key = middleSquareNumber * middleSquareNumber;
        }
        return false;
    }
    function getNextMidnumber(key) {
        var lenKey = lenInt(key);
        var keyDifference = lenKey - 5;
        var halfKeyDifference = keyDifference / 2;
        var middleSquareNumber = key.toString().substring(halfKeyDifference, 5 + halfKeyDifference);
        return zeroFill(middleSquareNumber, 5);
    }
    
    function zeroFill(number, width) {
        width -= number.toString().length;
        if ( width > 0 ) {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + "";
        }
        function lenInt(int) {
        return int.toString().length;
    }

    function sendToken(token, student, date)
    {
        var xhr = new XMLHttpRequest();
        var url = "https://prod-191.westeurope.logic.azure.com:443/workflows/94c54a662e4f4000bd10c08d302b2d70/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tQkSrnbRGWRZGouQThCGH0T002Um1rULdBFfhsIxn9I"
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
            }
        };

        var data = JSON.stringify({
            token: token,
            student: student,
            date: date
          });
        xhr.send(data);
    }

    return (
        <>
            <h1 className="card-title mb-5">Welcome {user.displayName} 👋!</h1>
            <Form className="container" noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-12 token-input">
                <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">║█║▌</InputGroup.Text>

                    <Form.Control onChange={handleChange}
                        type="text"
                        placeholder="Type your token"
                        aria-describedby="inputGroupPrepend"
                        required isInvalid={!validated} isValid={validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        {incorrectTokenMessage}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        {correctTokenMessage}
                    </Form.Control.Feedback>
                </InputGroup>
                    </div>
                    <div className="col-12">
                <Button className="col-md-2 col-xs-12" variant="primary" type="submit">
                    Submit
                </Button>
                    </div>
                    <p>{holder.map(toto => toto.toString()).join()}</p>
                </div>
            </Form>
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(getAuth());

    if (user) {
        return        (
            <div className="App">
                <ProfileContent />
            </div>
        );
    } else
        return (
            <div className="App">
                    <h5 className="card-title">You must be logged in to validate your presence.</h5>
                    <SignInButton />
            </div>
        );
};

export default function Main() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}