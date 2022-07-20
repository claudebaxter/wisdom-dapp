'reach 0.1'; //Instruction to the compiler

const commonInteract = {}; //Lines 3-9 define empty (for now) participant interaction interface objects.
const sellerInteract = {
    ...commonInteract,
};
const buyerInteract = {
    ...commonInteract,
};

export const main = Reach.App(() => { //Reach standard application initialize
    const S = Participant('Seller', sellerInteract); //Define a constant to represent seller
    const B = Participant('Buyer', buyerInteract); //Define a constant to represent buyer
    init(); //Finalize participant and other options, and proceed to a Reach step

    exit(); //Terminate computation
