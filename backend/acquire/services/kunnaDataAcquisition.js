const getDataKunna = async (targetDate) => {
    const endDate = new Date(targetDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 3);

    const startDateForApi = startDate.toISOString().split('.')[0] + 'Z';
    const endDateForApi = endDate.toISOString().split('.')[0] + 'Z';

    const headers = {
        'Content-Type': 'application/json',
    };

    const body = {
        // "time_start": startDateForApi,
        // "time_end": endDateForApi,

        "time_start": "2025-01-16T05:18:38Z",
        "time_end": "2025-01-20T05:18:38Z",

        "filters": [
            { "filter": "name", "values": ["1d"] },
            { "filter": "uid", "values": ["MLU00360002"] }
        ],
        "limit": 100,
        "count": false,
        "order": "DESC"
    };
    
    const response = await fetch(process.env.KUNNA_URL, {
        method: 'POST',
        headers: headers, 
        body: JSON.stringify(body),
    });

    if(!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Error de la API externa: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const apiData = await response.json();
    
    return apiData; 
};

module.exports = { getDataKunna };