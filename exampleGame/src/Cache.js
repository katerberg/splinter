import {gearTypes} from './constants.js';

class Cache {
  constructor(level, type, name, attack = 0, defense = 0, hp = 0) {
    if (name) {
      this.defaultConstructor(type, name, attack, defense, hp);
    } else {
      this.randomConstructor(level);
    }
  }

  defaultConstructor(type, name, attack, defense, hp) {
    this.type = type;
    this.name = name;
    this.modifiers = {
      attack,
      defense,
      hp,
    };
  }

  randomConstructor(level) {
    this.type = splinter.default.RNG.getWeightedValue(gearTypes);
    this.name = 'Butterfly';
    this.modifiers = {
      defense: 0,
      attack: 0,
      hp: 0,
    };
    switch (
      this.type // eslint-disable-line default-case
    ) {
      case 'Armor':
        this.modifiers.defense = splinter.default.RNG.getUniformInt(level, level + 5);
        break;
      case 'Weapon':
        this.modifiers.attack = splinter.default.RNG.getUniformInt(level, level + 5);
        break;
      case 'Amulet':
        this.modifiers.hp = splinter.default.RNG.getUniformInt(level, level + 20);
        break;
    }
  }

  get display() {
    return `${this.type} of the ${this.name}`;
  }

  get modifier() {
    return this.modifiers.attack || this.modifiers.defense || this.modifiers.hp;
  }
}

export default Cache;
