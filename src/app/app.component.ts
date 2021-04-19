import {Component} from '@angular/core';
import package_config from '../../package.json';
import {PwaService} from "./pwa.service";
import {HISCORE_ZERO, STORAGE_KEYS, StorageService} from "./storage.service";
import { TranslateService } from '@ngx-translate/core';
import {environment} from "../environments/environment.prod";

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
  hiscore: number;
  newHiscore: boolean;
  info: any = {
    author: package_config.author,
    version: package_config.version,
    name: package_config.name,
    year: new Date().getFullYear(),
  };

  constructor(public Pwa: PwaService, public storage: StorageService, public translate: TranslateService) {
    translate.addLangs(environment.locales);
    translate.setDefaultLang(environment.defaultLocale);
    translate.use(translate.getBrowserLang());
    this.init(this.width);
  }

  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }

  init(width: number): void {
    this.steps = 0;
    this.width = width;
    this.original = [];
    this.hiscore = JSON.parse(this.storage.get(STORAGE_KEYS.HISCORE)) || HISCORE_ZERO;
    this.newHiscore = false;

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
    let result = JSON.stringify(this.field) === JSON.stringify(this.original);
    if (result) {
      if (this.hiscore[this.width] > this.steps || this.hiscore[this.width] === 0) {
        if (this.hiscore[this.width] > 0) {
          this.newHiscore = true;
        }
        this.hiscore[this.width] = this.steps;
        this.storage.set(STORAGE_KEYS.HISCORE, JSON.stringify(this.hiscore));
      }
    }
    return result;
  }

  generateCss(expr: any, replicate: number = 1) {
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
