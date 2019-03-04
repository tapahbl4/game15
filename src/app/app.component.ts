import { Component } from '@angular/core';

const CELL_EMPTY = 0;
enum Direction {LEFT = 'left', RIGHT = 'right', UP = 'up', DOWN = 'down'}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    width: number;
    original: number[];
    field: number[];
    steps: number;

    constructor() {
        this.init(4);
    }

    init(width: number) {
        this.steps = 0;
        this.width = width;
        this.original = [];

        for (let i = 0; i < (width * width) - 1; i++) {
            this.original.push(i + 1);
        }

        this.field = Object.assign([], this.original);
        this.field = this.shuffle(this.field);
        this.original.push(CELL_EMPTY);
        this.field.push(CELL_EMPTY);
    }

    shuffle(array: any[]): any[] {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    checkCell(index: number): boolean|Direction {
        if (this.field[index] == CELL_EMPTY) return false;
        if (index >= this.width && this.field[index - this.width] == CELL_EMPTY) return Direction.UP;
        if ((this.width * this.width - 1) - index >= this.width && this.field[index + this.width] == CELL_EMPTY) return Direction.DOWN;
        if (index > 0 && this.field[index - 1] == CELL_EMPTY) return Direction.LEFT;
        if ((index < (this.width * this.width) - 1) && this.field[index + 1] == CELL_EMPTY) return Direction.RIGHT;
        return false;
    }

    move(index: number, direction: Direction|boolean) {
        if (direction !== false) {
            let sign = (direction === Direction.LEFT || direction === Direction.UP) ? -1 : 1,
                value = (direction === Direction.LEFT || direction === Direction.RIGHT) ? 1 : this.width;

            this.field[index + sign * value] = this.field[index];
            this.field[index] = CELL_EMPTY;

            this.steps++;
        }
    }

    isGameOver(): boolean {
        return JSON.stringify(this.field) === JSON.stringify(this.original);
    }

    clickCell(index: number) {
        let direction = this.checkCell(index);
        if (direction !== false) {
            this.move(index, direction);
        }
    }
}
