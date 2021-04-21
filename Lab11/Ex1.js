function isNonNegInt(val, returnErrors=false) {
    errors = [];
    if(Number(val) != val) errors.push('Not a number!'); 
    if(val < 0) errors.push('Negative value!'); 
    if(parseInt(val) != val) errors.push('Not an integer!'); 
    return returnErrors ? errors : ((errors.length > 0)? false:true);
}


attributes = "<Chloe>;<21>;<MIS>"
parts = attributes.split(';');


for(part of parts){
    console.log(isNonNegInt(part));
}

//console.log(parts);
