const processLocation = (str) => {
    let splitLocation = str.split(',');
    let len1 = splitLocation[0].length;
    let len2 = splitLocation[1].length;
    let newLocation = splitLocation[0].substring(0 , len1-2) + "," + splitLocation[1].substring(0 , len2-2);
    return newLocation;
}

const processPollutionData = (aqi) => {
    let splitAqi = aqi.split(',');
    let numAqi = splitAqi.map((numStr) => {
        // let len = numStr.length;
        // let subStr = numStr.substring(0,len-2);
        return parseFloat(numStr);
    })
    return numAqi; 
}

export {processLocation , processPollutionData};