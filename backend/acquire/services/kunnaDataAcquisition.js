// services/kunnaDataAcquisition.js

const getDates = () => {
    const now = new Date();

    const options = { 
        timeZone: 'Europe/Madrid', 
        hour: '2-digit',       
        hour12: false          
    };
    
    const madridHourString = now.toLocaleString('es-ES', options);
    const madridHour = parseInt(madridHourString);

    let targetDate = new Date(now);

    if (madridHour >= 23){
        targetDate.setDate(now.getDate() + 1);
    }
    console.log(`[ACQUIRE] La fecha objetivo es ${targetDate.toLocaleDateString()}`);

    const endDate = new Date(targetDate);
    endDate.setDate(targetDate.getDate() - 1);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 3);

    const startDateForApi = startDate.toISOString().split('.')[0] + 'Z';
    const endDateForApi = endDate.toISOString().split('.')[0] + 'Z';

    return { startDateForApi, endDateForApi, targetDate };
};

const getDataKunna = async () => {
    const { startDateForApi, endDateForApi, targetDate } = getDates();

    const headers = {
        'Content-Type': 'application/json',
    }

    const body = {
        //"time_start": startDateForApi,
        //"time_end": endDateForApi,

        "time_start": "2025-11-24T05:18:38Z",
        "time_end": "2025-11-27T05:18:38Z",

            "filters": [
            {
            "filter": "name",
            "values": [
                "1d"
            ]
            }, {"filter": "uid",
            "values": [
                "MLU00360002"
            ]
            }
        ],

        "limit": 100,
        "count": false,
        "order": "DESC"
    }
    
    const response = await fetch(process.env.KUNNA_URL, {
        method: 'POST',
        headers: headers, 
        body: JSON.stringify(body),
    });

    if(!response.ok) {
        const errorBody = await response.text();
        throw new Error(`${response.status} ${response.statusText} - ${errorBody}`);
    }

    const apiData = await response.json();
    console.log(apiData);
    return { apiData, targetDate };
};

module.exports = { getDataKunna };