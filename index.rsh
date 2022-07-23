'reach 0.1';

const commonInteract = {};
const sellerInteract = { // user-defined Reach object
  ...commonInteract,     // The spread syntax ... adds all commonInteract properties (none yet) to the object.
  price: UInt,           // price is a UInt, a Reach-defined unsigned integer
  reportReady: Fun([UInt], Null), // reportReady is a function that takes a UInt as an argument and returns nothing.
};
const buyerInteract = { //buyerInteract is a user-defined Reach object. 
  ...commonInteract, //The spread syntax ... adds all commonInteract properties (none yet) to the object. 
  confirmPurchase: Fun([UInt], Bool) //confirmPurchase is a function that takes a UInt and returns a Bool. 
};

export const main = Reach.App(() => {
  const S = Participant('Seller', sellerInteract);
  const B = Participant('Buyer', buyerInteract);
  init();               //init initializes the DApp, and transitions to a step.
  
  S.only(() => { const price = declassify(interact.price); }); //S.only() transitions to a local step in which seller gets price. 
  S.publish(price); //S.publish() transitions to a consensus step. 
  S.interact.reportReady(price); //S.interact transitions to a local step in which seller passes price to frontend. 
  commit(); //commit() transitions to a step. 

  B.only (() => { const willBuy = declassify(interact.confirmPurchase(price)); }); //confirmPurchase passes price and returns true or false from frontend. 
  B.publish(willBuy); //B.publish() transitions to a consensus step. 
  if (!willBuy) {
    commit(); //commit() transitions to a step. 
    } else {
      commit();
    }
  exit(); //halts the contract forever
});