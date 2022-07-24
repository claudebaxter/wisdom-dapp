'reach 0.1';

const commonInteract = {
  reportCancellation: Fun([], Null),
  reportPayment: Fun([UInt], Null),
  reportTransfer: Fun([UInt], Null)
};
const sellerInteract = { // user-defined Reach object
  ...commonInteract,     // The spread syntax ... adds all commonInteract properties (none yet) to the object.
  price: UInt,           // price is a UInt, a Reach-defined unsigned integer
  wisdom: Bytes(128),
  reportReady: Fun([UInt], Null), // reportReady is a function that takes a UInt as an argument and returns nothing.
};
const buyerInteract = { //buyerInteract is a user-defined Reach object. 
  ...commonInteract, //The spread syntax ... adds all commonInteract properties (none yet) to the object. 
  confirmPurchase: Fun([UInt], Bool), //confirmPurchase is a function that takes a UInt and returns a Bool. 
  reportWisdom: Fun([Bytes(128)], Null)
};

export const main = Reach.App(() => {
  const S = Participant('Seller', sellerInteract);
  const B = Participant('Buyer', buyerInteract);
  const V = View('Main', { price: UInt });
  init();               //init initializes the DApp, and transitions to a step.
  
  S.only(() => { const price = declassify(interact.price); }); //S.only() transitions to a local step in which seller gets price. 
  S.publish(price); //S.publish() transitions to a consensus step. 
  S.interact.reportReady(price); //S.interact transitions to a local step in which seller passes price to frontend. 
  V.price.set(price);
  commit(); //commit() transitions to a step. 

  B.only (() => { const willBuy = declassify(interact.confirmPurchase(price)); }); //confirmPurchase passes price and returns true or false from frontend. 
  B.publish(willBuy); //B.publish() transitions to a consensus step. 
  if (!willBuy) {
    commit(); //commit() transitions to a step. 
    each([S, B], () => interact.reportCancellation())
    exit();
    } else {
      commit();
    }
  
B.pay(price); //buyer always pays the contract
each([S, B], () => interact.reportPayment(price)); //each calls interact.reportpayment for each participant in the array
commit();

S.only(() => { const wisdom = declassify(interact.wisdom); }); //After buyer commits to purchase the seller declassifies the wisdom
S.publish(wisdom); //Seller makes the wisdom available to the buyer
transfer(price).to(S);
commit();

each([S, B], () => interact.reportTransfer(price)); //each calls interact.reportTRansfer for each participant in the array
B.interact.reportWisdom(wisdom); //Buyer sends the new wisdom to the frontend for the user.

exit(); //halts the contract forever
});