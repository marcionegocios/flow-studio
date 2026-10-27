import { getFlowState } from "../dist/flow.js";

const state = await getFlowState(true);
console.log("Flow State:", JSON.stringify(state, null, 2));
process.exit(0);
