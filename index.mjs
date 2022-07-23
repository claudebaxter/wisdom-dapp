import { loadStdlib } from '@reach-sh/stdlib'; //import the Reach JS Standard Library loader
import * as backend from './build/index.main.mjs'; //import the JS backend compiled from index.rsh
import { ask } from '@reach-sh/stdlib';
if (process.argv.length < 3 || ['seller', 'buyer'].includes(process.argv[2]) == false) {
    console.log('Usage: reach run index [seller|buyer]');
    process.exit(0);
}
const role = process.argv[2];
console.log(`Your role is ${role}`); //Display the role

const stdlib = loadStdlib(process.env); //Load the reach JS Stdlib for the consensus network specified by REACH_CONNCECTOR_MODE env var.
console.log(`The consensus network is ${stdlib.connector}.`); //Display the consensus network type.
const suStr = stdlib.standardUnit;
const toAU = (su) => stdlib.parseCurrency(su);
const toSU = (au) => stdlib.formatCurrency(au, 4);
const iBalance = toAU(1000);
const showBalance = async (acc) => console.log(`Your balance is ${toSU(await stdlib.balanceOf(acc))} ${suStr}.`);

const commonInteract = {}; // Define an empty (for now) common interaction object.

// Seller
if (role === 'seller') { //Code for when you run this app as the seller.
    const sellerInteract = { //Define an empty (for now) Seller interaction object.
        ...commonInteract,
        price: toAU(5),
        reportReady: async (price) => {
            console.log(`Your wisdom is for sale at ${toSU(price)} ${suStr}.`);
            console.log(`Contract info: ${JSON.stringify(await ctc.getInfo())}`);
        },
    };

const acc = await stdlib.newTestAccount(iBalance); //Create an account for the seller. parseCurrency transforms units from standard to atomic.
await showBalance(acc);
const ctc = acc.contract(backend); //Get a reference to the contract.
await ctc.participants.Seller(sellerInteract); //Initiate interaction with contract for seller.
await showBalance(acc);


// Buyer
} else { //Code for when you run this app as the buyer
    const buyerInteract = { //lines 24&25--Define empty (for now) Buyer interaction object.
        ...commonInteract,
        confirmPurchase: async (price) => await ask.ask(`Do you want to purchase wisdom for ${toSU(price)} ${suStr}?`, ask.yesno),
    }; //ask.ask and ask.yesno are functions in @reach-sh/stdlib. ask.yesno accepts only y or n
    const acc = await stdlib.newTestAccount(iBalance);
    const info = await ask.ask('Paste contract info:', (s) => JSON.parse(s));
    const ctc = acc.contract(backend, info);
    await showBalance(acc); // You must parse contract information (so, it must be parsable).
    await ctc.p.Buyer(buyerInteract); //You can substitute participants for p.
    await showBalance(acc);
}; //You can substitute participants for p.

ask.done(); // Needs to be after above closing tag so that it is accessible by both buyer and seller.