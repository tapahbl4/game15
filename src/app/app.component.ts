import { Component } from '@angular/core';
import package_config from '../../package.json';

const CELL_EMPTY = 0;
enum Direction {LEFT = 'left', RIGHT = 'right', UP = 'up', DOWN = 'down'}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  width = 4;
  original: number[];
  field: number[];
  steps: number;
  info: any = {
    author: package_config.author,
    version: package_config.version,
    name: package_config.name,
    year: new Date().getFullYear(),
  };

  constructor() {
    console.log(this.info);
    this.init(this.width);
  }

  init(width: number): void {
    this.steps = 0;
    this.width = width;
    this.original = [];

    for (let i = 0; i < (width * width) - 1; i++) {
      this.original.push(i + 1);
    }

    this.field = Object.assign([], this.original);
    do {
      this.field = this.shuffle(this.field);
    } while (this.checkField());

    this.original.push(CELL_EMPTY);
    this.field.push(CELL_EMPTY);
  }

    checkCell(index: number): boolean|Direction {
      if (this.field[index] == CELL_EMPTY) return false;

    let line = Math.floor(index / this.width),
      xStart = line * this.width,
      xEnd = (line + 1) * this.width,
      yStart = index - xStart,
      yEnd = this.width * this.width - this.width + yStart;

    for (let i = xStart; i < xEnd; i++) {
      if (this.field[i] == CELL_EMPTY) {
        return i > index ? Direction.RIGHT : Direction.LEFT;
      }
    }

    for (let i = yStart; i <= yEnd; i += this.width) {
      if (this.field[i] == CELL_EMPTY) {
        return i > index ? Direction.DOWN : Direction.UP
      }
    }

    return false;
  }

  move(index: number, direction: Direction|boolean) {
    if (direction !== false) {
      let sign = (direction === Direction.LEFT || direction === Direction.UP) ? -1 : 1,
        value = (direction === Direction.LEFT || direction === Direction.RIGHT) ? 1 : this.width,
        inc = value * sign,
        i = index + inc,
        tmp = this.field[index];

      this.field[index] = CELL_EMPTY;

      do {
        let localTmp = this.field[i];
        this.field[i] = tmp;
        tmp = localTmp;
        i += inc;
      } while (tmp != CELL_EMPTY);

      this.steps++;
    }
  }

  isGameOver(): boolean {
    return JSON.stringify(this.field) === JSON.stringify(this.original);
  }

  generateCss(expr: string, replicate: number = 1) {
    return (expr + '%').repeat(replicate);
  }

  checkField(): boolean {
    let sum = 0;
    this.field.map((value, index, array) => {
      if (value == CELL_EMPTY || index + 1 == array.length) return;
      let copy = Object.assign([], array).slice(index + 1);
      copy.map(value1 => sum += (value1 > value ? 1 : 0));
    });
    return (sum + this.width) % 2 == 0;
  }

  shuffle(arr: any[]): any[] {
    let currentIndex = arr.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }
    return arr;
  }
}
