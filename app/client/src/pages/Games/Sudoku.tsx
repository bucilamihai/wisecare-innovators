import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
  IonText,
} from "@ionic/react";
import chatIcon from "../../images/Default_RoboBuddy.svg"

// Sudoku Generator
const SudokuGenerator = () => {
  const GRID_SIZE = 9;

  const createEmptyGrid = (): (number | null)[][] => {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  };

  const solveGrid = (grid: (number | null)[][]): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveGrid(grid)) return true;
              grid[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValid = (
    grid: (number | null)[][],
    row: number,
    col: number,
    num: number,
  ): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  };

  const generateFullGrid = (): (number | null)[][] => {
    const grid = createEmptyGrid();
    solveGrid(grid);
    return grid;
  };

  const generatePuzzle = (emptyCells: number): (number | null)[][] => {
    const fullGrid = generateFullGrid();
    const puzzle = fullGrid.map((row) => [...row]);
    let cellsToEmpty = emptyCells;
    while (cellsToEmpty > 0) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        cellsToEmpty--;
      }
    }
    return puzzle;
  };

  return { generatePuzzle };
};

// Main Sudoku Component
const Sudoku: React.FC = () => {
  const { generatePuzzle } = SudokuGenerator();
  const EMPTY_CELLS = 15; // Number of empty cells
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [initialGrid, setInitialGrid] = useState<(number | null)[][]>([]);
  const [encouragementMessage, setEncouragementMessage] =
    useState<string>("Good luck!");
  const [messageOpacity, setMessageOpacity] = useState<number>(1);

  const encouragementMessages = [
    "Keep going! You're doing great!",
    "Another step closer to victory!",
    "You're unstoppable!",
    "Keep it up, Sudoku champion!",
    "You're on fire!",
    "Brilliant move!",
    "Sudoku master in the making!",
    "This puzzle doesn't stand a chance!",
  ];

  useEffect(() => {
    const newPuzzle = generatePuzzle(EMPTY_CELLS);
    setGrid(newPuzzle);
    setInitialGrid(newPuzzle.map((row) => [...row]));
  }, []);

  const isGridComplete = (): boolean => {
    return grid.every((row) => row.every((cell) => cell !== null));
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== null || selectedNumber === null) return;

    const newGrid = [...grid];
    newGrid[row][col] = selectedNumber;
    setGrid(newGrid);

    const newMessage =
      encouragementMessages[
        Math.floor(Math.random() * encouragementMessages.length)
      ];
    setEncouragementMessage(newMessage);
    setMessageOpacity(1);

    setTimeout(() => setMessageOpacity(0), 2000);

    if (isGridComplete()) {
      setTimeout(() => {
        alert("🎉 Congratulations! You've completed the Sudoku puzzle! 🎉");
      }, 100);
    }
  };

  const resetGrid = () => {
    const newPuzzle = generatePuzzle(EMPTY_CELLS);
    setGrid(newPuzzle);
    setInitialGrid(newPuzzle.map((row) => [...row]));
    setEncouragementMessage("Good luck!");
    setMessageOpacity(1);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sudoku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ "--background": "#EFEFEF" }}>
        {/* Sudoku Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 1fr)",
            maxWidth: "500px",
            margin: "auto",
            gap: "2px",
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  paddingTop: "100%",
                  position: "relative",
                  backgroundColor:
                    initialGrid[rowIndex][colIndex] === null
                      ? "#FFFFFF"
                      : "#AFAFAF",
                  border: "1px solid #ccc",
                  cursor:
                    initialGrid[rowIndex][colIndex] === null
                      ? "pointer"
                      : "default",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    color: "#151515",
                  }}
                >
                  {cell !== null ? cell : ""}
                </span>
              </div>
            )),
          )}
        </div>

        {/* Number Selection */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <IonButton
              key={num}
              onClick={() => setSelectedNumber(num)}
              color={selectedNumber === num ? "primary" : "medium"}
              style={{ flex: "0 1 50px" }}
            >
              {num}
            </IonButton>
          ))}
        </div>

        <IonButton expand="block" color="danger" onClick={resetGrid}>
          New Puzzle
        </IonButton>
      </IonContent>

      {/* Encouragement Footer */}
      <IonFooter
          style={{
            "--border-color": "transparent", // Removes border if any
            "--ion-box-shadow": "none", // Removes shadow if any
            backgroundColor: "transparent", // Matches the background
          }}
      >
        <IonToolbar
            style={{
              "--border-color": "transparent", // Removes any potential border
              "--ion-box-shadow": "none", // Removes shadow
              backgroundColor: "transparent", // Matches the footer background
            }}
        >
          <div
              style={{
                display: "flex", // Flexbox for alignment
                alignItems: "center", // Vertically center the SVG and text
                justifyContent: "flex-start", // Align content to the left
                gap: "10px", // Space between the image and text
                padding: "10px",
                backgroundColor: "white", // Rounded box background
                borderRadius: "12px", // Rounded corners
                maxWidth: "500px", // Optional: Restrict box size
                margin: "auto", // Center the box horizontally
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: Shadow for styling
              }}
          >
            {/* SVG Image */}
            <img
                src={chatIcon} // Path to your SVG
                alt="Chat Icon"
                style={{
                  width: "24px",
                  height: "24px",
                }}
            />

            {/* Text */}
            <IonText
                style={{
                  textAlign: "left", // Align text to the left
                  color: "black", // Set text color to black
                  fontSize: "1.2em",
                }}
            >
              {encouragementMessage}
            </IonText>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Sudoku;
