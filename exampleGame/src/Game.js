export class Game {
  display;

  constructor() {
    this.display = new splinter.default.Display({width: 80, height: 60});
    document.body.appendChild(this.display.getContainer());
  }
}
export const name = "square";
export const otherName = "circle";