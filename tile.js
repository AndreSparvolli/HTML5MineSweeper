// Tile Class

function Tile(x, y, positionX, positionY, size) {
    this.x = x;
    this.y = y;
    this.arrayPositionX = positionX;
    this.arrayPositionY = positionY;
    this.size = size;
    this.value = 0;
    this.state = false;
    this.flag = false;
    this.mark = false
    this.text = '';
    this.strokeColor = '#000000';
    this.fillColor = '#C0C0C0';
    this.textColor = '';
}

Tile.prototype = {
    addValue: function() {
        this.value += 1;
        this.setText();
    },
    setText: function() {
        this.text = (this.value >= 0 ? this.value.toString() : 'B');
        this.textColor = this.getTextColor(this.value >= 0 ? this.value : 7);
    },
    changeState: function() {
        this.state = true;
        this.fillColor = (this.value >= 0 ? '#E0E0E0' : '#FF0000');
    },
    setBomb: function() {
        this.value = -1;
        this.text = 'B';
        this.textColor = this.getTextColor(7);
    },
    setFlagOn: function() {
        this.flag = true;
        this.text = 'X';
        this.textColor = '#000000';
    },
    setMarkOn: function() {
        this.flag = false;
        this.mark = true;
        this.text = String.fromCharCode(63);
        this.textColor = '#000000';
    },
    setMarkOff: function() {
        this.mark = false;
        this.setText();
    },
    isBomb: function() {
        return (this.value < 0);
    },
    isBlank: function() {
        return (this.value == 0);
    },
    isPressed: function() {
        return this.state;
    },
    checkForClick: function(mouseX, mouseY) {
        if ((mouseX > this.x && mouseX < (this.x + this.size)) &&
            (mouseY > this.y && mouseY < (this.y + this.size))) {

            return true;
        }

        return false;
    },
    getTextColor: function(value) {
        var color;

        switch (value) {
            case 1:
                color = '#0100FE';
                break;
            case 2:
                color = '#017F01';
                break;
            case 3:
                color = '#FE0000';
                break;
            case 4:
                color = '#010080';
                break;
            case 5:
                color = '#810102';
                break;
            case 6:
                color = '#008081';
                break;
            case 7:
                color = '#000000';
                break;
            case 8:
                color = '#808080';
                break;
        }

        return color;
    },
    draw: function(context) {
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.size, this.size);

        context.lineWidth = 1;
        context.strokeStyle = this.strokeColor;
        context.strokeRect(this.x, this.y, this.size, this.size);

        if (this.state || this.flag || this.mark) {
            context.font = '25px Arial';
            context.textAlign = 'center'
            context.fillStyle = this.textColor;
            context.fillText(this.text, this.x + (this.size / 2), this.y + (this.size / 2) + 9);
        }
    }
}