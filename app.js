document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreContainer = document.querySelector('.scoreContainer');
    const width = 4;
    let blocks = [];

    //Setup the grid size.
    grid.style.gridTemplateColumns = 'repeat(' + width + ', 1fr)';
    grid.style.gridTemplateRows = 'repeat(' + width + ', 1fr)';

    //Find the sizes for elements within the grid.
    let margin = 400 * 0.05 / width;
    let blockSize = getBlockSizes();
    function getBlockSizes() {
        let size = (400 - margin * width * 2) / width;
        return size;
    }

    //Start the game by creating the board and getting the score.
    createBoard();
    // createTestBoard();
    getScore();

    //Function to create the board for the game.
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            block = document.createElement('div');
            block.innerHTML = '';
            grid.appendChild(block);
            blocks.push(block);

            blocks[i].style.width = blockSize + 'px';
            blocks[i].style.height = blockSize + 'px';
            blocks[i].style.lineHeight = blockSize * 0.98 + 'px';
            blocks[i].style.fontSize = blockSize * 0.36 + 'px'
            blocks[i].style.margin = margin + 'px'
            blocks[i].style.borderRadius = blockSize * 0.067 + 'px';
        }
        createNewBlock();
        createNewBlock();
    }

    //Function to create a new '2' block on the board.
    function createNewBlock() {
        if (checkForLoss()) return;
        // checkForWin();

        let randomNumber = Math.floor(Math.random() * blocks.length);
        if (blocks[randomNumber].innerHTML == '') {
            blocks[randomNumber].innerHTML = 2;
        }
        else createNewBlock();
    }

    //Function that creates a board where through code you can specifiy where
    //specific blocks are placed.
    function createTestBoard() {
        for (let i = 0; i < width * width; i++) {
            block = document.createElement('div');
            block.innerHTML = '';
            grid.appendChild(block);
            blocks.push(block);
        }
        createSpecificBlock(2, 0, 2);
        createSpecificBlock(4, 1, 2);
        createSpecificBlock(8, 2, 2);
        createSpecificBlock(32, 3, 2);
        createSpecificBlock(32, 0, 3);
    }

    //Function that places specific blocks within a test board.
    function createSpecificBlock(number, x, y) {
        blocks[x + y * width].innerHTML = number;
    }

    //Function that checks if the player has lost.
    function checkForLoss() {
        let emptyBlocksCount = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].innerHTML === '') emptyBlocksCount += 1;
        }
        if (emptyBlocksCount <= 0) {
            endGame(false);
            return true;
        }
        return false;
    }

    //Function that checks if the player has created a block with the number '2048'.
    function checkForWin() {
        let hasWon = false;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].innerHTML === '2048') {
                hasWon = true;
                break;
            }
        }
        if (hasWon) {
            endGame(true);
            return true;
        }
        return false;
    }

    //Function that will end the game.
    function endGame(hasWon = false) {
        if (autoRotating) clearInterval(autoRotateTimer);

        if (hasWon) {
            console.log('You Won!');
        }
        else {
            console.log('You Lost!');
        }
    }

    //Function the adds together the total score and displays it.
    function getScore() {
        let total = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].innerHTML != ''){
                total += parseInt(blocks[i].innerHTML);
            }
        }
        scoreContainer.innerHTML = total;
    }

    document.addEventListener('keyup', keyPress);
    //Function that determines what certain keyboard inputs do.
    function keyPress(e) {
        // console.log(e.code);
        switch (e.code) {
            case 'ArrowLeft':
                //Left
                arrowKeyPress(1);
                break;
            case 'ArrowUp':
                //Up
                arrowKeyPress(2);
                break;
            case 'ArrowRight':
                //Right
                arrowKeyPress(3);
                break;
            case 'ArrowDown':
                //Down
                arrowKeyPress(4);
                break;
            case 'Space':
                if (autoRotating) {
                    clearInterval(autoRotateTimer);
                    autoRotating = false;
                }
                else {
                    autoRotateTimer = setInterval(autoRotate, 1);
                    autoRotating = true;
                }
                break;
        }
    }

    //Function that is used after the player presses an arrow key.
    function arrowKeyPress(direction) {
        //Save the board state before moving blocks.
        let boardState = [];
        for (let i = 0; i < blocks.length; i++) {
            boardState.push(blocks[i].innerHTML);
        }

        moveBlocks(direction)
        combineBlocks(direction);
        moveBlocks(direction);

        //Check if the board state has changed and
        //don't create a new block if it hasn't.
        let sameBlockCount = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (boardState[i] === blocks[i].innerHTML) sameBlockCount++;
        }
        if (sameBlockCount >= width * width) return;

        createNewBlock();
        getScore();
        setBlockColors();
    }

    //Function that will move all of the blocks in a specific direction.
    // 1 = Left, 2 = Up, 3 = Right, 4 = Down
    function moveBlocks(direction) {
        if (direction == 1 || direction == 3) {
            //Left and Right
            for (let i = 0; i < blocks.length; i++) {
                //At the start of every row...
                if (i % width === 0) {
                    let newRow = [];
                    //Create an array of all of the existing blocks...
                    for (let j = 0; j < width; j++) {
                        if (blocks[i + j].innerHTML != '') newRow.push(blocks[i + j].innerHTML);
                    }
                    //Push empty spaces...
                    let emptyBlocksCount = width - newRow.length;
                    for (let j = 0; j < emptyBlocksCount; j++) {
                        //To the appropriate sides of the array...
                        if (direction == 1) newRow.push('');
                        else newRow.unshift('');
                    }
                    //And then apply the newRow.
                    for (let j = 0; j < width; j++) {
                        blocks[i + j].innerHTML = newRow[j];
                    }
                }
            }
        }
        else if (direction == 2 || direction == 4) {
            //Up and Down
            for (let i = 0; i < width; i++) {
                //At the start of every column...
                let newColumn = [];
                //Create an array of all of the existing blocks...
                for (let j = 0; j < width; j++) {
                    if (blocks[i + j * width].innerHTML != '') newColumn.push(blocks[i + j * width].innerHTML);
                }
                //Push empty spaces...
                let emptyBlocksCount = width - newColumn.length;
                for (let j = 0; j < emptyBlocksCount; j++) {
                    //To the appropriate sides of the array...
                    if (direction == 2) newColumn.push('');
                    else newColumn.unshift('');
                }
                //And then apply the newColumn.
                for (let j = 0; j < width; j++) {
                    blocks[i + j * width].innerHTML = newColumn[j];
                }
            }
        }
    }
    
    //Function that will combine smae number blocks that have hit each other.
    function combineBlocks(direction) {
        //Left
        if (direction === 1) {
            //Row
            for (let i = 0; i < width - 1; i++) {
                //Column
                for (let j = 0; j < width; j++) {
                    let curBlock = blocks[i + j * width];
                    let nextBlock = blocks[i + 1 + j * width];
                    if (nextBlock == undefined) continue;
                    if (curBlock.innerHTML === '' || nextBlock.innerHTML === '') continue;

                    if (curBlock.innerHTML === nextBlock.innerHTML) {
                        let total = parseInt(curBlock.innerHTML) * 2;
                        curBlock.innerHTML = total;
                        nextBlock.innerHTML = '';
                    }
                }
            }
        }
        //Up
        else if (direction === 2) {
            //Row
            for (let i = 0; i < width; i++) {
                //Column
                for (let j = 0; j < width - 1; j++) {
                    let curBlock = blocks[i + j * width];
                    let nextBlock = blocks[i + width + j * width];
                    if (nextBlock == undefined) continue;
                    if (curBlock.innerHTML === '' || nextBlock.innerHTML === '') continue;

                    if (curBlock.innerHTML === nextBlock.innerHTML) {
                        let total = parseInt(curBlock.innerHTML) * 2;
                        curBlock.innerHTML = total;
                        nextBlock.innerHTML = '';
                    }
                }
            }
        }
        //Right
        else if (direction === 3) {
            //Row
            for (let i = width - 1; i >= 0; i--) {
                //Column
                for (let j = width - 1; j >= 0; j--) {
                    let curBlock = blocks[i + j * width];
                    let nextBlock = blocks[i - 1 + j * width];
                    if (nextBlock == undefined) continue;
                    if (curBlock.innerHTML === '' || nextBlock.innerHTML === '') continue;

                    if (curBlock.innerHTML === nextBlock.innerHTML) {
                        let total = parseInt(curBlock.innerHTML) * 2;
                        curBlock.innerHTML = total;
                        nextBlock.innerHTML = '';
                    }
                }
            }
        }
        //Down
        else if (direction === 4) {
            //Row
            for (let i = width - 1; i >= 0; i--) {
                //Column
                for (let j = width - 1; j >= 0; j--) {
                    let curBlock = blocks[i + j * width];
                    let nextBlock = blocks[i - width + j * width];
                    if (nextBlock == undefined) continue;
                    if (curBlock.innerHTML === '' || nextBlock.innerHTML === '') continue;

                    if (curBlock.innerHTML === nextBlock.innerHTML) {
                        let total = parseInt(curBlock.innerHTML) * 2;
                        curBlock.innerHTML = total;
                        nextBlock.innerHTML = '';
                    }
                }
            }
        }
    }

    //Function that will update all of the blocks' colors.
    function setBlockColors() {
        for (let i = 0; i < blocks.length; i++) {
            switch (blocks[i].innerHTML) {
                default:
                    blocks[i].style.backgroundColor = '#235499';
                    break;
                case '':
                    blocks[i].style.backgroundColor = 'var(--black_low_high)';
                    break;
                case '2':
                    blocks[i].style.backgroundColor = '#2FB5BA';
                    break;
                case '4':
                    blocks[i].style.backgroundColor = '#2BBD8A';
                    break;
                case '8':
                    blocks[i].style.backgroundColor = '#2CBD38';
                    break;
                case '16':
                    blocks[i].style.backgroundColor = '#A2BD30';
                    break;
                case '32':
                    blocks[i].style.backgroundColor = '#BDA72A';
                    break;
                case '64':
                    blocks[i].style.backgroundColor = '#BD802E';
                    break;
                case '128':
                    blocks[i].style.backgroundColor = '#BD4322';
                    break;
                case '256':
                    blocks[i].style.backgroundColor = '#BD1F31';
                    break;
                case '512':
                    blocks[i].style.backgroundColor = '#AA20BD';
                    break;
                case '1024':
                    blocks[i].style.backgroundColor = '#7324BD';
                    break;
                case '2048':
                    blocks[i].style.backgroundColor = '#2725BD';
                    break;
            }
        }
    }

    setBlockColors();

    //Thsi section will make the board automatically move in a circle pattern by hitting 'space'.
    //Hitting 'space' again will pause it.
    var autoRotateTimer;
    let autoRotateID = 1;
    let autoRotating = false;
    function autoRotate() {
        arrowKeyPress(autoRotateID);
        autoRotateID += 1;
        if (autoRotateID > 4) autoRotateID = 1;
    }
})