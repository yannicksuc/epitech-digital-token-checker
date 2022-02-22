import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { ProfileData } from "./components/ProfileData";
import { callMsGraph } from "./graph";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./styles/App.css";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [validated, setValidated] = useState(false);

    console.log(accounts[0])

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        const token = event.target[0].value;
        if (form.checkValidity() && checkToken(token)) {
            sendToken(token, accounts[0].username, new Date().toISOString());
            setValidated(true);
        }
        event.preventDefault();
        event.stopPropagation();
      };

    const handleChange = (event) => {
        const input = event.currentTarget;
        setValidated(checkToken(input.value));
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
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            <Form className="container" noValidate validated={validated} onSubmit={handleSubmit}>
                <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">║█║▌</InputGroup.Text>
                    <Form.Control onChange={handleChange}
                        type="text"
                        placeholder="Type your token"
                        aria-describedby="inputGroupPrepend"
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid token.
                    </Form.Control.Feedback>
                </InputGroup>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            {graphData ?
                <ProfileData graphData={graphData} /> :
                <Button variant="secondary" onClick={RequestProfileData}>Request Profile Information</Button>
            }
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {    
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">You must be logged in to validate your presence.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}