window.onload = function() {
  console.log('Loaded');
  
  const sudokuContainer = document.getElementById('sudoku-container')
  let grid = {}
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let validGrid = false
  let validGridTentatives = 0
  let maxTentatives = 200
  let stop = false

  // Methods
  const clear = () => {
    console.log('Clear that sudoku!')
    sudokuContainer.innerHTML = ""
    grid = {}
  }

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a 
  }
  
  const getNumbers = () => {
    return shuffle(numbers)
  }

  const getSquareCoordinates = (x, y) => {
    let squareX = 1
    let squareY = 1

    if (x > 3 && x < 7) {
      squareX = 2
    } else if (x >= 7) {
      squareX = 3
    }

    if (y > 3 && y < 7) {
      squareY = 2
    } else if (y >= 7) {
      squareY = 3
    }

    let square = {x: squareX, y: squareY}

    return square
  }

  const checkSquare = (number, x , y) => {
    let square = getSquareCoordinates(x, y)
    let startY = (3 * square.y) - 2
    let startX = (3 * square.x) - 2
    let isValidNumber = true

    for(let y = startY; y < startY + 3; y++) {
      for(let x = startX; x < startX + 3; x++) {
        if (grid[y][x] === number) {
          isValidNumber = false
        }
      }
    }

    return isValidNumber
  }

  const getAvailableNumber = (remainingNumbers, x, y) => {
    
    let validNumber = remainingNumbers.find((number) => {
      let isValidNumber = true;
      //console.log(`Check row ${y} and column ${x} with number ${number} which is equal to ${grid[y][x]}`);
      
      // Check row 
      for (let gridY = 1; gridY <= 9; gridY++) {
        if (grid[gridY][x] === number) {
          //console.log(`Grid[${gridY}][${x}] === ${number}`)
          isValidNumber = false;
        }
      }

      // Check column
      if (isValidNumber) {
        for (let gridX = 1; gridX <= 9; gridX++) {
          if(grid[y][gridX] === number) {
            //console.log(`Grid[${y}][${gridX}] === ${number}`)
            isValidNumber = false;
          }
        }
      }

      // Check square
      isValidNumber = isValidNumber ? checkSquare(number, x, y) : false

      return isValidNumber;
    })

    //console.log(`valid number for ${x}, ${y} = ${validNumber}`)
    return validNumber || 0
  }

  const getGridStructure = () => {
    for(let y = 1; y <= 9; y++) {
      let line = {}
      for (let x = 1; x <= 9; x++) {
        line[x] = 0
      }
      grid[y] = line
    }
    console.log('zeroed grid', grid);
  }

  const fillGrid = () => {
    let hasZero = false
    validGridTentatives ++

    for(let y = 1; y <= 9; y++) {
      let numbers = getNumbers()
      for (let x = 1; x <= 9; x++) {
        grid[y][x] = getAvailableNumber(numbers, x, y)
        if (grid[y][x] === 0) {
          hasZero = true
        }
      }
    }

    return !hasZero
  }

  const createTable = () => {
    let table = document.createElement('table')
    table.id = 'table-grid'

    for (let y in grid) {
      let row = document.createElement('tr')
      
      for (let x in grid) {
        let cell = document.createElement('td')
        cell.innerHTML = grid[y][x]
        row.appendChild(cell)
      }

      table.appendChild(row)
    }

    sudokuContainer.appendChild(table);
  }

  const createGrid = () => {
    getGridStructure()
    while(!validGrid && !stop) {
      validGridTentatives = validGridTentatives >= maxTentatives
      console.log(`tentative #${validGridTentatives}`);
      validGrid = fillGrid()
    }
    if(validGrid) {
      createTable()
    }
    
  }

  const init = () => {
    clear() // On commence par cleaner le sudoku
    createGrid()
  }

  init()

} 