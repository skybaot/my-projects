// Global variables
let price = 20; // initial price, can be reassigned
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
]; // initial cash-in-drawer, can be reassigned

// Get HTML elements
const cashInput = document.getElementById("cash");
const changeDueElement = document.getElementById("change-due");
const purchaseButton = document.getElementById("purchase-btn");

// Add event listener to purchase button
purchaseButton.addEventListener("click", handlePurchase);

// Function to handle purchase
function handlePurchase() {
  const cash = parseFloat(cashInput.value); // get cash from input

  // Check if customer has enough money
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  // Calculate change due
  const changeDue = cash - price;

  // Check if customer paid with exact cash
  if (changeDue === 0) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    return;
  }

  // Check if cash-in-drawer can cover change due
  const totalCashInDrawer = cid.reduce((acc, curr) => acc + curr[1], 0);
  if (totalCashInDrawer < changeDue) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  // Check if exact change can be made
  if (totalCashInDrawer === changeDue) {
    changeDueElement.textContent = "Status: CLOSED";
    displayChange(cid, true);
    return;
  }

  // Make change
  const change = makeChange(changeDue, cid);
  if (change === null) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
  } else {
    changeDueElement.textContent = "Status: OPEN";
    displayChange(change);
  }
}

// Function to make change
function makeChange(changeDue, cid) {
  const change = [];
  const denominations = [
    ["ONE HUNDRED", 100],
    ["TWENTY", 20],
    ["TEN", 10],
    ["FIVE", 5],
    ["ONE", 1],
    ["QUARTER", 0.25],
    ["DIME", 0.1],
    ["NICKEL", 0.05],
    ["PENNY", 0.01]
  ];

  for (const [denomination, value] of denominations) {
    const index = cid.findIndex((item) => item[0] === denomination);
    if (index === -1) continue;

    const amountInDrawer = cid[index][1];
    const amountToGive = Math.min(amountInDrawer, Math.floor(changeDue / value) * value);
    changeDue -= amountToGive;
    changeDue = parseFloat(changeDue.toFixed(2)); // avoid floating point issues

    if (amountToGive > 0) {
      change.push([denomination, amountToGive]);
      cid[index][1] -= amountToGive;
    }

    if (changeDue === 0) break;
  }

  return changeDue === 0 ? change : null;
}

// Function to display change
function displayChange(change, isClosed = false) {
  if (isClosed) {
    const nonEmptyDenominations = cid.filter((item) => item[1] > 0);
    const changeHTML = nonEmptyDenominations
      .map((item) => `${item[0]}: $${item[1].toFixed(2)}`)
      .join(" ");
    changeDueElement.textContent += " " + changeHTML;
  } else {
    const changeHTML = change
      .map((item) => `${item[0]}: $${item[1].toFixed(2)}`)
      .join(" ");
    changeDueElement.textContent += " " + changeHTML;
  }
}
