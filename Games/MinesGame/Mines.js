let container = document.getElementById("container");
let body = document.body;
let explosionSound = document.getElementById("explosion");
let secret = document.getElementById("secret");
let addForm = document.getElementById("add-form");
let mineForm = document.getElementById("mine-form");
let numberOfMines = document.querySelector("#dropdown");
let AddModel = document.getElementById("add-model");
let totalProfit = document.getElementById("total-profit");
let WrongPaddMssg = document.getElementById("wrong-passcode-message");
let totalProfitMultiply = document.querySelector("#total-profit h2");
let totalProfitAmnt = document.querySelector("#profit-main h4");
let bigOverlay = document.getElementById("big-overlay");
let volumeIcon = document.getElementById("volumeIcon");
let lootOverlay = document.getElementById("loot-overlay");
let btn = document.getElementById("btn");
let amt = document.getElementById("amt");
let btn_bomb = document.querySelector("#btn p");
let looseModel = document.getElementById("loose-model");
let winModel = document.getElementById("win-model");
let overlay = document.getElementById("overlay");
let close = document.querySelector(".close");
let lowMoney = document.getElementById("low-money-message");
let totalMoney = document.querySelector("#wallet-main p");
let walletMoney = localStorage.getItem("walletMoney");
totalMoney.innerText = walletMoney;
let inputField = document.querySelector("#amount input");
let gained = document.querySelector("#bottom-win h4");
let mutiplied = document.querySelector("#top-win h2");
let half = document.getElementById("half");
let double = document.getElementById("double");
let fullWallet = document.getElementById("full-wallet");
let arr = [];
let flag = 0;
let allMines;
let profit;
let plotmineWork = true;
let isMuted = true;
let betAmount = 0;
let mineValue = 0;
let timesProfit = 0;
let previousInputValue = "";
let previousMineValue = "";
let mutipliedMoney;
let gems, mines, unClicked;

function changeBetAmt() {
  half.addEventListener("click", () => {
    let currentBetAmt = Number(localStorage.getItem("betAmount"));
    betAmount = (currentBetAmt / 2).toFixed(3);
    inputField.value = betAmount;
    localStorage.setItem("betAmount", Math.abs(betAmount));
  });
  double.addEventListener("click", () => {
    let currentBetAmt = Number(localStorage.getItem("betAmount"));
    betAmount = (currentBetAmt * 2).toFixed(3);
    inputField.value = betAmount;
    localStorage.setItem("betAmount", Math.abs(betAmount));
  });
  fullWallet.addEventListener("click", () => {
    let currentWalletMoney = Number(localStorage.getItem("walletMoney"));
    betAmount = currentWalletMoney;
    inputField.value = betAmount;
    localStorage.setItem("betAmount", Math.abs(betAmount));
  });
}

mineForm.addEventListener("input", (e) => {
  // console.log(numberOfMines.value);
});

window.onload = function () {
  let savedBetAmount = localStorage.getItem("betAmount");
  if (savedBetAmount !== null) {
    inputField.value = savedBetAmount;
    betAmount = Number(savedBetAmount);
  }
  let savedNumberOfMines = localStorage.getItem("numberOfMines");
  if (savedNumberOfMines !== null) {
    numberOfMines.value = savedNumberOfMines;
  }
};

inputField.addEventListener("input", function (e) {
  betAmount = Number(inputField.value);
  localStorage.setItem("betAmount", Math.abs(betAmount));
  if (e.data == "-") {
    inputField.value = Math.abs(inputField.value);
  }
});

numberOfMines.addEventListener("input", () => {
  localStorage.setItem("numberOfMines", numberOfMines.value);
});

close.addEventListener("click", (e) => {
  location.reload();
});

if (!localStorage.getItem("walletMoney")) {
  localStorage.setItem("walletMoney", "100");
}

document.querySelector(".cross").addEventListener("click", () => {
  AddModel.style.scale = "0";
  bigOverlay.style.display = "none";
});

amt.addEventListener("input", function () {
  previousInputValue = inputField.value;
  if (isNaN(inputField.value)) {
    inputField.value = previousInputValue;
  } else {
    betAmount = Number(inputField.value);
  }
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (secret.value == "99") {
    let current = Number(localStorage.getItem("walletMoney"));
    let updated = current + Math.abs(Number(amt.value));
    localStorage.setItem("walletMoney", updated);
    location.reload();
  } else {
    WrongPaddMssg.style.top = "10%";
    bigOverlay.style.display = "block";
    setTimeout(() => {
      bigOverlay.style.display = "none";
      WrongPaddMssg.style.top = "-10%";
    }, 5000);
  }
});

function getDivWithNumber(number) {
  const div = document.querySelector(`div[data-number='${number}']`);
  return div;
}

function checkBetAmount() {
  betAmount = Math.abs(Number(inputField.value));
  previousInputValue = Math.abs(inputField.value);
  inputField.addEventListener("input", function (e) {
    if (isNaN(inputField.value)) {
      inputField.value = previousInputValue;
    } else {
      betAmount = Math.abs(Number(inputField.value));
    }
  });
}

function makeSpaces() {
  let clutter = "";
  for (let i = 0; i < 25; i++) {
    clutter += `<div class="mine" data-number="${i + 1}"></div>`;
  }
  container.innerHTML = clutter;
  allMines = document.querySelectorAll(".mine");
}

function calculateProfit(chances, baseProfit, numberOfMines) {
  numberOfMines = Number(numberOfMines.value);
  let profit =
    baseProfit * Math.pow(1.2, numberOfMines) * Math.pow(1.1, chances);
  profit = profit.toFixed(3);
  mutipliedMoney = profit / baseProfit;
  mutipliedMoney = mutipliedMoney.toFixed(2);
  mutiplied.innerText = mutipliedMoney;
  gained.innerText = "$" + profit;
  if (chances === 0) {
    profit = baseProfit;
    mutipliedMoney = 0;
    mutiplied.innerText = mutipliedMoney.toFixed(2);
    gained.innerText = "$" + profit;
  }
  manageMoney(profit);
}

function workingBtn() {
  if (plotmineWork) {
    btn.addEventListener("click", () => {
      if (winModel.style.scale === "1" || looseModel.style.scale === "1") {
        return;
      }

      if (flag == 0) {
        totalProfit.style.display = "block";
        // btn_bomb.innerHTML = `<img src="btn.png" alt="">`;
        btn_bomb.innerText = `CashOut`;
        flag = 1;
        plotMine();
        scaling();
        lootOverlay.style.display = "block";
        let currentWalletMoney = Number(localStorage.getItem("walletMoney"));

        if (betAmount > currentWalletMoney || betAmount == 0) {
          lowMoney.style.top = "10%";
          bigOverlay.style.display = "block";
          return;
        }
      } else {
        totalProfit.style.display = "none";
        let currentWalletMoney = Number(localStorage.getItem("walletMoney"));
        if (betAmount > currentWalletMoney) {
          bigOverlay.style.display = "block";
          lowMoney.style.top = "10%";
          return;
        }

        let updatedWalletMoney = (
          currentWalletMoney - Math.abs(betAmount)
        ).toFixed(3);
        if (updatedWalletMoney < 0) {
          lowMoney.style.top = "10%";
          close.addEventListener("click", () => {
            lowMoney.style.top = "-20%";
          });
          return;
        }

        localStorage.setItem("walletMoney", updatedWalletMoney);
        totalMoney.innerText = updatedWalletMoney;

        btn_bomb.innerHTML = `<p>Bet</p>`;
        flag = 0;
        winModel.style.scale = 1;
        btn.addEventListener("click", () => {
          location.reload();
        });
        plotmineWork = false;
        lootOverlay.style.display = "none";
        overlay.style.display = "block";
        plotLeft();
        let chances = arr.length;
        let baseProfit = betAmount;
        calculateProfit(chances, baseProfit, numberOfMines);
      }
    });
  }
}

function plotMine() {
  if (looseModel.style.scale === "1") {
    return;
  }

  mines = [];
  gems = [];
  while (mines.length < numberOfMines.value) {
    let rn = Math.floor(Math.random() * 25) + 1;
    if (!mines.includes(rn)) {
      mines.push(rn);
    }
  }
  for (let i = 1; i < 26; i++) {
    if (!mines.includes(i)) {
      gems.push(i);
    }
  }
  // console.log(mines);
  // console.log(gems);

  allMines.forEach((m) => {
    m.addEventListener("click", (dets) => {
      let target = dets.target;
      if (!arr.includes(target)) {
        arr.push(target);
      }
      let mine = Number(target.getAttribute("data-number"));
      if (mines.includes(mine)) {
        m.style.backgroundImage = "url('bomb.png')";
        blast();
        let currentWalletMoney = Number(localStorage.getItem("walletMoney"));
        let updatedWalletMoney = (
          currentWalletMoney - Math.abs(betAmount)
        ).toFixed(3);
        if (updatedWalletMoney < 0) {
          bigOverlay.style.display = "block";
          lowMoney.style.top = "10%";
          return;
        }
        localStorage.setItem("walletMoney", updatedWalletMoney);
        totalMoney.innerText = updatedWalletMoney;
        looseModel.style.scale = 1;
        overlay.style.display = "block";
        btn.addEventListener("click", () => {
          location.reload();
        });
        plotLeft();
      } else {
        setTimeout(() => {
          m.style.backgroundImage = "url('gem.png')";
          m.style.backgroundColor = "#06182";
        }, 250);
      }
    });
  });
}

function scaling() {
  document.querySelectorAll(".mine").forEach((m) => {
    m.addEventListener("click", () => {
      m.style.animation = `anime 0.4s ease-in-out 1 forwards`;
    });
  });
}

function plotLeft() {
  gems.forEach((e) => {
    let specificDiv = getDivWithNumber(e);
    specificDiv.style.backgroundImage = "url('gem.png')";
  });
  mines.forEach((e) => {
    let specificDiv = getDivWithNumber(e);
    specificDiv.style.backgroundImage = "url('bomb.png')";
  });
}

function reset() {
  overlay.addEventListener("click", () => {
    location.reload();
  });
}

function manageMoney(profit) {
  let currentMoney = Number(totalMoney.innerText);
  let newMoney = currentMoney + Number(profit);
  totalMoney.innerText = newMoney;
  localStorage.setItem("walletMoney", newMoney);
}

function addmodel() {
  bigOverlay.style.display = "block";
  AddModel.style.scale = "1";
}

function blast() {
  body.style.animation = "shake 0.7s ease-out 1 forwards";
  explosionSound.play();
  explosionSound.volume = 0.2;
}

makeSpaces();
workingBtn();
reset();
checkBetAmount();
changeBetAmt();

// for (let numberOfMines = 1; numberOfMines < 25; numberOfMines++) {
//     chances = 25-numberOfMines;
//     let a = Math.pow(1.2,numberOfMines) * Math.pow(1.1, chances);
//     // let a = Math.pow(1.13696,numberOfMines)
//     // let b = Math.pow(a,chances);/
//     console.log(numberOfMines,"with a profit of",a);

// }
