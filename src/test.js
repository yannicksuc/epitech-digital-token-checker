    function sendToken()
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
            token: "000fezffze0",
            student: "deedde@fr.fr",
            date: "23/12/2014 10:22:12 PM"
          });
        xhr.send(data);
    }

    sendToken();