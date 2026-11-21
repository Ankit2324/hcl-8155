export const isEligible=(atten)=>{
    if(atten<0 || atten>100)
        throw new Error("Invalid attendence value");
    return atten>=75;
}