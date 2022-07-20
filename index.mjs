import { loadStdlib } from '@reach-sh/stdlib'; //import the Reach JS Standard Library loader
import * as backend from './build/index.main.mjs'; //import the JS backend compiled from index.rsh

const role = 'seller'; //Hard-coding the role to be changed later
console.log(`Your role is ${role}`); //Display the role

const stdlib = loadStdlib(process.env); //Load the reach JS Stdlib for the consensus network specified by REACH_CONNCECTOR_MODE env var.
console.log(`The consensus network is ${stdlib.connector}.`); //Display the consensus network type.

const commonInteract = {}; // Define an empty (for now) common interaction object.