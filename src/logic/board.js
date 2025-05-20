export const checkEndGame = (boardToCheck) => {
    return boardToCheck.every(square => square !== null)
  }
  
export const checkwinner = (boardToCheck, lastPlayIndex) => {
    if (checkHorizontalCombos(boardToCheck, lastPlayIndex) || 
        checkVerticalCombos(boardToCheck, lastPlayIndex)   ||
        checkDiagonalCombos(boardToCheck, lastPlayIndex)) 
        {
        return boardToCheck[lastPlayIndex] // X u O
        }
    else return null
}

export const checkCombos = (boardToCheck, lastMovePos, posStep, lineStep) => {
    let victory = false
    let linePtr = 0 //posicion de inicio de la linea
    //- posStep: distancia e/ posiciones de la linea - lineStep: distancia entre 2 lineas (en posiciones)

    // recorrer lineas buscando combos ganadores
    while (!victory && linePtr <= lineStep*2) { 
        let linePositions = [linePtr, linePtr + posStep, linePtr + posStep *2] // posiciones donde empiezan las lineas a chequear (filas, columnas)    
        if (linePositions.includes(lastMovePos)) {
        victory = checkLine(boardToCheck, linePositions)
        }
        linePtr += lineStep ;
    }
    return victory
}

export const checkHorizontalCombos = (boardToCheck, lastMovePos) => 
    checkCombos (boardToCheck, lastMovePos, 1, 3);

export const checkVerticalCombos = (boardToCheck, lastMovePos) => 
    checkCombos (boardToCheck, lastMovePos, 3, 1);

export const checkDiagonalCombos = (boardToCheck, lastMovePos) => {
    let victory = null
    const combos = [[0,4,8], [2,4,6]]; // combos diagonales ganadores
    combos.forEach( combo => {
        if (combo.includes(lastMovePos)) { // la posicion esta en el combo
        victory = checkLine(boardToCheck, combo)
    }});
    return victory
}

export const checkLine = (boardToCheck, line) => {
    return boardToCheck[line[0]] === boardToCheck[line[1]] && 
            boardToCheck[line[0]] === boardToCheck[line[2]]
}