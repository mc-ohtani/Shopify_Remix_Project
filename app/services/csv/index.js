// import { convertFreee } from "./freee";
// import { convertMoneyforward } from "./moneyforward";

// export function convertCsv(csvText, target) {
//   switch (target) {
//     case "freee":
//       return convertFreee(csvText);
//     case "moneyforward":
//       return convertMoneyforward(csvText);
//     default:
//       throw new Error("Unsupported target");
//   }
// }
import { convertFreee } from "./freee.js";
import { convertMoneyForward } from "./moneyforward.js";

export function convertCsv(target, records) {
  switch (target) {
    case "freee":
      return convertFreee(records);
    case "moneyforward":
      return convertMoneyForward(records);
    default:
      throw new Error("Unknown CSV target");
  }
}