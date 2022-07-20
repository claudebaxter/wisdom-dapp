import { loadStdlib } from '@reach-sh/stdlib'; //import the Reach JS Standard Library loader
import * as backend from './build/index.main.mjs'; //import the JS backend compiled from index.rsh

const role = 'seller'; //Hard-coding the role to be changed later
console.log(`Your role is ${role}`); //Display the role

const stdlib = loadStdlib(process.env); //Load the reach JS Stdlib for the consensus network specified by REACH_CONNCECTOR_MODE env var.
console.log(`The consensus network is ${stdlib.connector}.`); //Display the consensus network type.

const commonInteract = {}; // Define an empty (for now) common interaction object.

// Seller
if (role === 'seller') { //Code for when you run this app as the seller.
    const sellerInteract = { //Define an empty (for now) Seller interaction object.
        ...commonInteract,
    }

const acc = await stdlib.newTestAccount(stlib.parseCurrency(1000)); //Create an account for the seller. parseCurrency transforms units from standard to atomic.
const ctc = acc.contract(backend); //Get a reference to the contract.
await ctc.participants.Seller(sellerInteract); //Initiate interaction with contract for seller.

// Buyer
} else { //Code for when you run this app as the buyer
    const buyerInteract = { //lines 24&25--Define empty (for now) Buyer interaction object.
        ...commonInteract,
    };

};