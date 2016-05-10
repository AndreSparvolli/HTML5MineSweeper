// MineField Class

function Minefield(context, rows, cols, mines) {
    this.context = context;
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.flagsAvaible = mines;
    this.activeTiles = rows * cols;
    this.mineTriggered = false;
    this.tileQueue = [];
    this.field = this.initializeField(rows, cols);
}

Minefield.prototype = {
    initializeField: function(rows, cols) {
        var tempField = new Array(rows), i;

        for (i = 0; i < rows; i++) {
            tempField[i] = new Array(cols);
        }

        return tempField;
    },
    populateField: function(tileSize, initPosX, initPosY) {
        var Y_POS = initPosY;

        for (var i = 0; i < this.rows; i++) {
            Y_POS += tileSize;
            var X_POS = initPosX;

            for (var j = 0; j < this.cols; j++) {
                this.field[i][j] = new Tile(X_POS, Y_POS, i, j, tileSize);
                X_POS += tileSize;
            }
        }
    },
    generateBombs: function() {
        var bombsSet = 0;
        var tile;

        do {
            var randomX = Math.floor(Math.random() * this.rows);
            var randomY = Math.floor(Math.random() * this.cols);
            tile = this.field[randomX][randomY];

            if (tile.value >= 0) {
                tile.setBomb();
                this.updateBombSurrounds(randomX, randomY);
                bombsSet++;
            }
        } while (bombsSet != this.mines);
    },
    updateBombSurrounds: function(x, y) {
        var tempX = x - 1;
        var tempY = y - 1;
        var i, j;

        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if ((tempX >= 0 && tempX < this.rows) && (tempY >= 0 && tempY < this.cols) && !this.field[tempX][tempY].isBomb()) {
                    this.field[tempX][tempY].addValue();
                }

                tempX++;
            }

            tempX = x - 1;
            tempY++;
        }
    },
    checkMouseClickForAction: function(event, mouseX, mouseY) {
        var i, j, tile;
        var isLeftClick = (event.which == 1 || event.button == 0);

        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.cols; j++) {
                tile = this.field[i][j];

                if (!tile.isPressed() && tile.checkForClick(mouseX, mouseY)) {

                    if (isLeftClick) {
                        if (!tile.flag) {
                            if (tile.mark) {
                                tile.setMarkOff();
                            }

                            if (!tile.isBomb()) {
                                if (!tile.isBlank()) {
                                    tile.changeState();
                                    this.activeTiles--;
                                } else {
                                    this.processTile(tile);
                                }
                            } else {
                                this.showAllBombs();
                                this.mineTriggered = true;
                            }
                        }
                    } else {
                        if (!tile.flag && !tile.mark) {
                            if (this.flagsAvaible > 0) {
                                this.flagsAvaible--;
                                tile.setFlagOn();
                            }
                        } else {
                            if (tile.flag) {
                                tile.setMarkOn();
                                this.flagsAvaible++;
                            } else {
                                tile.setMarkOff();
                            }
                        }
                    }
                    
                    return;
                }
            }
        }
    },
    processTile: function(tile) {
        if (tile.mark) {
            tile.setMarkOff();            
        }

        tile.changeState();
        this.activeTiles--;
        this.checkSurroundingTiles(tile.arrayPositionX, tile.arrayPositionY);

        if (this.tileQueue.length > 0) {
            tile = this.tileQueue.shift();
            this.processTile(tile);
        }
    },
    checkSurroundingTiles: function(arrayPosX, arrayPosY) {
        var tempX = arrayPosX - 1;
        var tempY = arrayPosY - 1;
        var i, j, tile;

        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if ((tempX >= 0 && tempX < this.rows) && (tempY >= 0 && tempY < this.cols)) {
                    tile = this.field[tempX][tempY];

                    if (!tile.flag) {
                        if (!tile.isPressed() && this.tileQueue.lastIndexOf(tile) < 0) {
                            if (tile.isBlank()) {
                                this.tileQueue.push(tile);
                            } else {
                                tile.changeState();
                                this.activeTiles--;
                            }
                        }
                    }
                }

                tempX++;
            }

            tempX = arrayPosX - 1;
            tempY++;
        }
    },
    showAllBombs: function() {
        var i, j;

        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.cols; j++) {
                var tile = this.field[i][j];

                if (tile.isBomb()) {
                    tile.changeState();
                    this.activeTiles--;
                }
            }
        }
    },
    checkVictoryCondition: function() {
        return (this.activeTiles == this.mines);
    },
    drawField: function() {
        var i, j;
        
        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.cols; j++) {
                this.field[i][j].draw(this.context);
            }
        }
    }
};