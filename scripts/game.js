import { animateOnce, changeBalance } from "./functions.js";

let setNum = localStorage.getItem("chosen_ch") ?? 1;

let pieceMap = [
  { index: 0, color: "black", position: [0, 1], queen: false },
  { index: 1, color: "black", position: [0, 3], queen: false },
  { index: 2, color: "black", position: [0, 5], queen: false },
  { index: 3, color: "black", position: [0, 7], queen: false },

  { index: 4, color: "black", position: [1, 0], queen: false },
  { index: 5, color: "black", position: [1, 2], queen: false },
  { index: 6, color: "black", position: [1, 4], queen: false },
  { index: 7, color: "black", position: [1, 6], queen: false },

  { index: 8, color: "black", position: [2, 1], queen: false },
  { index: 9, color: "black", position: [2, 3], queen: false },
  { index: 10, color: "black", position: [2, 5], queen: false },
  { index: 11, color: "black", position: [2, 7], queen: false },

  { index: 12, color: "white", position: [7, 0], queen: false },
  { index: 13, color: "white", position: [7, 2], queen: false },
  { index: 14, color: "white", position: [7, 4], queen: false },
  { index: 15, color: "white", position: [7, 6], queen: false },

  { index: 16, color: "white", position: [6, 1], queen: false },
  { index: 17, color: "white", position: [6, 3], queen: false },
  { index: 18, color: "white", position: [6, 5], queen: false },
  { index: 19, color: "white", position: [6, 7], queen: false },

  { index: 20, color: "white", position: [5, 0], queen: false },
  { index: 21, color: "white", position: [5, 2], queen: false },
  { index: 22, color: "white", position: [5, 4], queen: false },
  { index: 23, color: "white", position: [5, 6], queen: false }
];

let turn = "white";
let active = null;
let capturePossible = false;
let routeList = [];

drawCells();
let cells = document.querySelectorAll(".cell");

drawPieces();

document.querySelector(".balance").innerHTML =
  localStorage.getItem("balance_ch");

for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
  let cell = cells[cellIndex];

  cell.onclick = () => {
    let piece = cell.dataset.piece ? JSON.parse(cell.dataset.piece) : null;
    let pieceElem = piece
      ? document.querySelector('.piece[data-index="' + piece.index + '"]')
      : null;

    if (piece && turn != piece.color) {
      return;
    }

    if (active != null && piece && active == piece.index) {
      active = null;
      pieceElem.classList.remove("active");
      routeList = [];

      for (let c of cells) {
        c.classList.remove("possible");
      }

      return;
    }

    if (active == null && piece) {
      active = piece.index;
      pieceElem.classList.add("active");

      showMoves(piece);

      return;
    }

    if (active != null && !piece && cell.classList.contains("possible")) {
      let piece = pieceMap[active];
      let pieceElem = document.querySelector(
        '.piece[data-index="' + active + '"]'
      );

      let [row, col] = [(cellIndex - (cellIndex % 8)) / 8, cellIndex % 8];
      let [oldRow, oldCol] = piece.position;

      pieceMap[active].position = [row, col];

      pieceElem.style.transform =
        "translate(" + col * 100 + "%, " + row * 100 + "%)";

      cells[oldRow * 8 + oldCol].dataset.piece = "";
      cell.dataset.piece = JSON.stringify(piece);

      if (routeList.length) {
        for (let i = 0; i < routeList.length; i++) {
          let route = routeList[i];

          if (row == route.position[0] && col == route.position[1]) {
            if (route.queen) {
              makeQueen(piece);
            }

            for (let [r, c] of route.capture) {
              let capturedPiece = document.querySelector(
                '.piece[data-index="' + pieceIndexByPos(r, c) + '"]'
              );

              pieceMap[pieceIndexByPos(r, c)].position = 0;
              capturedPiece.remove();

              cells[r * 8 + c].dataset.piece = "";
            }
          }
        }
      } else if (
        (turn == "white" && row == 0) ||
        (turn == "black" && row == 7)
      ) {
        makeQueen(piece);
      }

      for (let c of cells) {
        c.classList.remove("possible");
      }

      pieceElem.classList.remove("active");

      active = null;
      capturePossible = false;
      routeList = [];

      if (checkWin()) {
        gameOver();
      }

      turn = turn == "white" ? "black" : "white";
      document.querySelector(".turn").innerHTML = turn + "'s move";
      checkCapturePossible();
    }
  };
}

window.onload = () => {
  document.querySelector(".wrapper").classList.remove("hidden");
};

function pieceIndexByPos(row, col) {
  for (let p of pieceMap) {
    if (p.position[0] == row && p.position[1] == col) {
      return p.index;
    }
  }
}

function makeQueen(piece) {
  if (pieceMap[piece.index].queen) {
    return;
  }

  pieceMap[piece.index].queen = true;

  let pieceElem = document.querySelector(
    '.piece[data-index="' + piece.index + '"]'
  );

  let queen = document.createElement("img");
  queen.src =
    "../png/queen_" + (piece.color == "white" ? "black" : "white") + ".png";
  queen.classList.add("queen", "hidden");
  pieceElem.append(queen);

  let [r, c] = piece.position;
  cells[r * 8 + c].dataset.piece = JSON.stringify(piece);

  setTimeout(() => {
    queen.classList.remove("hidden");
  }, 150);
}

function showMoves(piece) {
  let vectors = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ];

  let [row, col] = piece.position;

  showCaptureMoves(row, col);

  if (!capturePossible) {
    showCommonMoves();
  }

  function showCommonMoves() {
    for (let i = 0; i < vectors.length; i++) {
      let vector = vectors[i];

      let [r, c] = [row + vector[0], col + vector[1]];

      if (
        r < 0 ||
        r > 7 ||
        c < 0 ||
        c > 7 ||
        (((turn == "white" && r > row) || (turn == "black" && r < row)) &&
          !piece.queen) ||
        cells[r * 8 + c].dataset.piece
      ) {
        continue;
      }

      cells[r * 8 + c].classList.add("possible");
    }
  }

  function showCaptureMoves(r, c) {
    let isQueen = piece.queen;

    checkCaptureAround(r, c);

    for (let i = 0; i < routeList.length; i++) {
      let [r, c] = routeList[i].position;

      cells[r * 8 + c].classList.add("possible");
    }

    function checkCaptureAround(row, col, exclude, routeG) {
      for (let i = 0; i < vectors.length; i++) {
        let route = routeG
          ? JSON.parse(JSON.stringify(routeG))
          : { position: 0, capture: [], queen: isQueen };

        let vector = vectors[i];

        let r1 = row + vector[0];
        let c1 = col + vector[1];

        let r2 = row + vector[0] * 2;
        let c2 = col + vector[1] * 2;

        if (
          exclude &&
          exclude[0] * -1 == vector[0] &&
          exclude[1] * -1 == vector[1]
        ) {
          continue;
        }

        if (r2 < 0 || r2 > 7 || c2 < 0 || c2 > 7) {
          continue;
        }

        if (
          cells[r1 * 8 + c1].dataset.piece &&
          JSON.parse(cells[r1 * 8 + c1].dataset.piece).color != turn &&
          !cells[r2 * 8 + c2].dataset.piece
        ) {
          if ((turn == "white" && r2 == 0) || (turn == "black" && r2 == 7)) {
            route.queen = true;
          }

          route.position = [r2, c2];
          route.capture.push([r1, c1]);

          routeList.push(route);
          console.log(JSON.stringify(route));

          checkCaptureAround(r2, c2, vector, route);
        }
      }
    }
  }
}

function checkWin() {
  let stillBlack = 0;
  let stillWhite = 0;

  for (let piece of pieceMap) {
    if (piece.position && piece.color == "white") {
      stillWhite++;
    } else if (piece.position && piece.color == "black") {
      stillBlack++;
    }
  }

  if (stillWhite && !stillBlack) {
    return "white";
  } else if (stillBlack && !stillWhite) {
    return "black";
  }
}

function gameOver() {
  changeBalance(500);
  animateOnce(".balance");

  document.querySelector(".game_over").style.left = "50%";
}

function checkCapturePossible() {
  for (let piece of pieceMap) {
    if (piece.color != turn || !piece.position) {
      continue;
    }

    let vectors = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ];
    let [row, col] = piece.position;

    for (let i = 0; i < vectors.length; i++) {
      let vector = vectors[i];

      let r1 = row + vector[0];
      let c1 = col + vector[1];

      let r2 = row + vector[0] * 2;
      let c2 = col + vector[1] * 2;

      if (r2 < 0 || r2 > 7 || c2 < 0 || c2 > 7) {
        continue;
      }

      if (
        cells[r1 * 8 + c1].dataset.piece &&
        JSON.parse(cells[r1 * 8 + c1].dataset.piece).color != turn &&
        !cells[r2 * 8 + c2].dataset.piece
      ) {
        capturePossible = true;
      }
    }
  }
}

function drawCells() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let cell = document.createElement("div");
      cell.classList.add("cell", "block", "set_" + setNum);

      let colorClass = (row + col) % 2 ? "cell_black" : "cell_white";
      cell.classList.add(colorClass);

      document.querySelector(".field").append(cell);
    }
  }
}

function drawPieces() {
  for (let piece of pieceMap) {
    let pieceElem = document.createElement("div");
    pieceElem.classList.add(
      "piece",
      "block",
      "piece_" + piece.color,
      "set_" + setNum
    );

    let [row, col] = piece.position;
    pieceElem.dataset.index = piece.index;
    pieceElem.style.transform =
      "translate(" + col * 100 + "%, " + row * 100 + "%)";

    document.querySelector(".field").append(pieceElem);

    cells[row * 8 + col].dataset.piece = JSON.stringify(piece);
  }
}
