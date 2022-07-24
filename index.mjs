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

const commonInteract = (role) => ({ // Define a common interaction object.
    reportCancellation: () => { console.log(`${role == 'buyer' ? 'You' : 'The buyer'} cancelled the order.`); },
    reportPayment: (payment) => { console.log(`${role == 'buyer' ? 'You' : 'The buyer'} paid ${toSU(payment)} ${suStr} to the contract.`) },
    reportTransfer: (payment) => { console.log (`The contract paid ${toSU(payment)} ${suStr} to ${role == 'seller' ? 'you' : 'the seller'}.`) }
}); //Line 21 ${role == } defines output based on user / seller if cancelled by buyer.

// Seller
if (role === 'seller') { //Code for when you run this app as the seller.
    const sellerInteract = { //Define an empty (for now) Seller interaction object.
        ...commonInteract(role),
        price: toAU(5),
        wisdom: await ask.ask('Enter a wise phrase, or press Enter for a default:', (s) => {
            let w = !s ? 'Build healthy communities.' : s;
            if (!s) { console.log(w); }
            return w;
        }),
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
    const buyerInteract = { // Buyer interaction object.
        ...commonInteract(role),
        confirmPurchase: async (price) => await ask.ask(`Do you want to purchase wisdom for ${toSU(price)} ${suStr}?`, ask.yesno),
        reportWisdom: (wisdom) => console.log(`Your new wisdom is "${wisdom}"`),
    }; //ask.ask and ask.yesno are functions in @reach-sh/stdlib. ask.yesno accepts only y or n
    const acc = await stdlib.newTestAccount(iBalance);
    const info = await ask.ask('Paste contract info:', (s) => JSON.parse(s));
    const ctc = acc.contract(backend, info);
    const price = await ctc.views.Main.price();
    console.log(`The price of wisdom is ${price[0] == 'None' ? '0' : toSU(price[1])} ${suStr}.`);
    await showBalance(acc); // You must parse contract information (so, it must be parsable).
    await ctc.p.Buyer(buyerInteract); //You can substitute participants for p.
    await showBalance(acc);
}; //You can substitute participants for p.

ask.done(); // Needs to be after above closing tag so that it is accessible by both buyer and seller.