import {xpLevels, dimensions, modalChoices, movementKeymap, validKeymap} from './constants.js';
import Cache from './Cache.js';
import Ladder from './Ladder.js';
import Modal from './Modal.js';

function getDisplayText(gear) {
  if (gear) {
    return `${gear.display} (+${gear.modifier})`;
  }
}

class Player {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.stats = {
      maxHp: 5,
      strength: 1,
      dexterity: 1,
    };
    this.gear = {
      Weapon: null,
      Armor: null,
      Amulet: null,
    };
    this.currentHp = 5;
    this.xp = 0;
    this.resolver = () => {};
  }

  get coordinates() {
    return `${this.x},${this.y}`;
  }

  get effectiveMaxHp() {
    return this.stats.maxHp + (this.gear.Amulet ? this.gear.Amulet.modifier : 0);
  }
  getDamage() {
    const modifier = this.gear.Weapon ? this.gear.Weapon.modifier : 0;
    return this.stats.strength + modifier;
  }

  handleEvent(evt) {
    const keyCode = evt.keyCode;
    if (keyCode === 81 && this.game.devmode) {
      // Q
      this.game.nextLevel();
    }
    if (keyCode === 69 && this.game.devmode) {
      // E
      this.levelUp();
    }
    if (!(keyCode in validKeymap)) {
      if (this.game.devmode) {
        console.log(`Keycode is ${keyCode}`); // eslint-disable-line no-console
      }
      return;
    }
    this.game.clearMessage();
    if (keyCode in movementKeymap) {
      this.handleMovement(keyCode);
    } else if (validKeymap[keyCode] === 'Gear') {
      this.handleOpenInventory();
    }
  }

  displayStat(stat, gear) {
    return `${this.stats[stat] + (gear ? gear.modifier : 0)}`.padStart(3);
  }

  releaseInput() {
    window.removeEventListener('keydown', this);
  }

  listenForInput() {
    window.addEventListener('keydown', this);
  }

  calculateDamage(incomingDamage, source) {
    const dexDiff = this.stats.dexterity - source.stats.dexterity;
    if (splinter.default.RNG.getPercentage() < dexDiff) {
      return null;
    }
    if (this.gear.Armor) {
      const percent = splinter.default.RNG.getPercentage() / 100;
      const damage = Math.ceil(incomingDamage - this.gear.Armor.modifier * percent);
      if (damage < 0) {
        return 0;
      }
      return damage;
    }

    return incomingDamage;
  }

  takeDamage(incomingDamage, enemy) {
    const damage = this.calculateDamage(incomingDamage, enemy);
    if (damage === null) {
      this.game.sendMessage(`You dodged the attack from a ${enemy.type.toLowerCase()}`);
    } else if (damage === 0) {
      this.game.sendMessage(`Your armor absorbed all the damage from a ${enemy.type.toLowerCase()}`);
    } else {
      this.game.sendMessage(`A ${enemy.type.toLowerCase()} hit you for ${damage} damage`);
    }
    this.currentHp -= damage;
    if (this.currentHp <= 0) {
      this.currentHp = 0;
    }
    this.draw();
    if (this.currentHp === 0) {
      this.releaseInput();
      this.game.loseGame(enemy);
    }
  }

  levelUp() {
    const currentDamage = this.effectiveMaxHp - this.currentHp;
    this.stats.maxHp += 3;
    this.stats.strength += 1;
    this.stats.dexterity += 1;
    this.currentHp = this.effectiveMaxHp - Math.ceil(currentDamage / 2);
    this.drawHp();
  }

  addXp(amount) {
    const formerLevel = this.level;
    this.xp += amount;
    if (this.level !== formerLevel) {
      this.game.sendMessage(`You are now level ${this.level}!`);
      this.levelUp();
    }
  }

  buildModalCallback(callback) {
    this.releaseInput();
    return (res) => {
      callback && callback(res);
      this.game.rebuild();
      this.listenForInput();
    };
  }
  get level() {
    return (
      parseInt(
        Object.keys(xpLevels).find((k) => xpLevels[k] > this.xp),
        10,
      ) - 1
    );
  }

  handleOpenInventory() {
    const pickupResponse = this.buildModalCallback();
    const gearText = `STR:${this.displayStat('strength', this.gear.Weapon)}    ${
      getDisplayText(this.gear.Weapon) || 'No weapon'
    }
    DEX:${this.displayStat('dexterity', this.gear.Armor)}    ${getDisplayText(this.gear.Armor) || 'No armor'}
    HP: ${this.displayStat('maxHp', this.gear.Amulet)}    ${getDisplayText(this.gear.Amulet) || 'No amulet'}
    XP: ${`${this.xp}`.padStart(3)}
    LVL: ${`${this.level}`.padStart(2)}`;
    new Modal(this.game.display, pickupResponse, gearText, 70, 5, 5);
  }

  equip(gear) {
    if (gear.type === 'Amulet') {
      if (this.gear.Amulet) {
        this.currentHp -= this.gear.Amulet.modifier;
      }
      this.currentHp += gear.modifier;
    }
    this.gear[gear.type] = gear;
    this.game.sendMessage(`New ${gear.type} equipped (${gear.modifier >= 0 ? '+' : ''}${gear.modifier})`);
  }

  handleMovement(keyCode) {
    const [xChange, yChange] = splinter.default.DIRS[4][movementKeymap[keyCode]];
    const newX = this.x + xChange;
    const newY = this.y + yChange;
    const newSpace = `${newX},${newY}`;
    if (this.game.map[newSpace] === undefined) {
      return;
    }
    const enemyInSpace = this.game.getEnemyAt(newSpace);
    if (enemyInSpace) {
      enemyInSpace.takeDamage(this.getDamage(), this);
      return this.resolver();
    }
    this.draw(newX, newY);
    const contents = this.game.retrieveContents(this.coordinates);
    if (contents instanceof Cache) {
      if (contents.type === 'Potion') {
        this.game.sendMessage(`Tastes awful, but heals ${contents.modifiers.hp}.`);
        this.currentHp += contents.modifiers.hp;
        if (this.currentHp > this.effectiveMaxHp) {
          this.currentHp = this.effectiveMaxHp;
        }
        this.game.removeCache(this.coordinates);
        this.drawHp();
        this.resolver();
      } else {
        const pickupResponse = this.buildModalCallback((res) => {
          if (res) {
            this.game.removeCache(this.coordinates);
            this.equip(contents);
          }
          this.resolver();
        });
        new Modal(
          this.game.display,
          pickupResponse,
          `${contents.display}. Would you like to equip it?`,
          20,
          20,
          5,
          modalChoices.yn,
        );
      }
    } else if (contents instanceof Ladder) {
      const nextLevelResponse = this.buildModalCallback((res) => {
        if (res) {
          this.game.nextLevel();
        }
      });
      new Modal(this.game.display, nextLevelResponse, 'Are you ready to delve deeper?', 20, 20, 5, modalChoices.yn);
    } else {
      this.resolver();
    }
  }

  act() {
    this.game.storeState(false);
    return new Promise((resolve) => {
      this.listenForInput();
      this.resolver = resolve;
    });
  }

  drawHp() {
    this.game.display.drawText(dimensions.WIDTH - 15, 0, 'HP:');
    const currentHpString = `${this.currentHp}`;
    const maxHpString = `${this.stats.maxHp + (this.gear.Amulet ? this.gear.Amulet.modifier : 0)}`;
    const start = dimensions.WIDTH - 12;
    for (let i = 0; i < currentHpString.length; i++) {
      this.game.display.draw(start + i, 0, currentHpString[i], null, null);
    }
    this.game.display.draw(start + currentHpString.length, 0, '/', null, null);
    for (let i = 0; i < maxHpString.length; i++) {
      this.game.display.draw(start + i + 1 + currentHpString.length, 0, maxHpString[i], null, null);
    }
    for (let i = 0; i <= 6 - maxHpString.length - currentHpString.length; i++) {
      this.game.display.draw(start + i + 1 + currentHpString.length + maxHpString.length, 0, ' ', null, null);
    }
  }

  draw(x, y) {
    const oldX = this.x;
    const oldY = this.y;
    this.x = x || oldX;
    this.y = y || oldY;
    this.game.drawFov();
    this.drawHp();
  }
}

export default Player;
