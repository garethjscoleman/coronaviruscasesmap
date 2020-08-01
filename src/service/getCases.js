
const axios = require("axios");

export const dataEndpoint = '/v1/data?filters=areaType=ltla&structure=%7B%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22cases%22:%22newCasesBySpecimenDate%22,%22date%22:%22date%22%7D&page=1' ;
export const dataHost ='https://api.coronavirus-staging.data.gov.uk';


export function getCases(endPoint){ 
    return getcase(endPoint);
};
    

const getcase = async (endPoint) => {
    
    const result = await getData(endPoint);

    return result;
}


const getData = async ( url ) => {

    const { data, status, statusText } = await axios.get(url, { timeout: 10000 });

    if ( status >= 400 )
        throw new Error(statusText);

    return data

}
