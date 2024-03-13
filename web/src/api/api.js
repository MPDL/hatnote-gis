import {environmentVariables} from "../configuration/environment";

export async function uploadValidators(data, password){
    try {
        const rawResponse = await fetch(environmentVariables.server_url + '/geoBloxbergValidators', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hatnote-gis-api-password': password
            },
            body: JSON.stringify(data)
        });

        if (rawResponse.ok) {
            return;
        }
        return Promise.reject('Response code was ' + rawResponse.status)
    } catch (e) {
        return Promise.reject("Error while writing validators. Error: " + e.toString())
    }
}

export async function getValidators(password){
    try {
        const rawResponse = await fetch(environmentVariables.server_url + '/geoBloxbergValidators', {
            method: 'GET',
            headers: {
                'hatnote-gis-api-password': password
            },
        });

        if (rawResponse.ok) {
            return rawResponse.json();
        }
        return Promise.reject('Response code was ' + rawResponse.status)
    } catch (e) {
        return Promise.reject("Error while reading validators. Error: " + e.toString())
    }
}

export async function uploadInstitutes(data, password){
    try {
        console.log(password)
        const rawResponse = await fetch(environmentVariables.server_url + '/geoMpgInstitutes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hatnote-gis-api-password': password
            },
            body: JSON.stringify(data)
        });

        if (rawResponse.ok) {
            return;
        }
        return Promise.reject('Response code was ' + rawResponse.status)
    } catch (e) {
        return Promise.reject("Error while writing institutes. Error: " + e.toString())
    }
}

export async function getInstitutes(password){
    try {
        const rawResponse = await fetch(environmentVariables.server_url + '/geoMpgInstitutes', {
            method: 'GET',
            headers: {
                'hatnote-gis-api-password': password
            },
        });

        if (rawResponse.ok) {
            return rawResponse.json();
        }
        return Promise.reject('Response code was ' + rawResponse.status)
    } catch (e) {
        return Promise.reject("Error while reading institutes. Error: " + e.toString())
    }
}