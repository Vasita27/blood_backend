const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.post('/api/predict', async (req, res) => {
    try {
        const { data } = req.body;
        console.log(data)
        const columns = ["Recency (months)", "Frequency (times)", "Monetary (c.c. blood)", "Time (months)"]

        const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

        // NOTE: you must manually enter your API_KEY below using information retrieved from your IBM Cloud account (https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/ml-authentication.html)
        const API_KEY = process.env.API_KEY;
go
        function getToken(errorCallback, loadCallback) {
            const req = new XMLHttpRequest();
            req.addEventListener("load", loadCallback);
            req.addEventListener("error", errorCallback);
            req.open("POST", "https://iam.cloud.ibm.com/identity/token");
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.setRequestHeader("Accept", "application/json");
            req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
        }

        function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
            const oReq = new XMLHttpRequest();
            oReq.addEventListener("load", loadCallback);
            oReq.addEventListener("error", errorCallback);
            oReq.open("POST", scoring_url);
            oReq.setRequestHeader("Accept", "application/json");
            oReq.setRequestHeader("Authorization", "Bearer " + token);
            oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            oReq.send(payload);
        }

        getToken((err) => console.log(err), function () {
            let tokenResponse;
            try {
                tokenResponse = JSON.parse(this.responseText);
            } catch (ex) {
                // TODO: handle parsing exception
            }
            // NOTE: manually define and pass the array(s) of values to be scored in the next line
            const payload = JSON.stringify({
                "input_data": [
                    {
                        "fields": columns,
                        "values": [data]
                    }
                ]
            });
            console.log("hi")
            console.log(payload)
            const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/f0f9e82a-4819-4eb7-a3ea-8f4a48efdd2d/predictions?version=2021-05-01";
            apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
                let parsedPostResponse;
                try {
                    parsedPostResponse = JSON.parse(this.responseText);
                } catch (ex) {
                    // TODO: handle parsing exception
                }
                console.log("Scoring response");
                console.log(parsedPostResponse);
                res.json(parsedPostResponse)
            }, function (error) {
                console.log(error);
            });
        });
    } catch (error) {
        console.error('Error fetching prediction:', error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});