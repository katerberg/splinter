import * as ROT from 'rot-js';
import * as util from './utils.js';

const {DIRS, FOV, RNG, Map, Display, Scheduler} = ROT;
const Util = util;
const Splinter = {
  Display,
  Scheduler,
  RNG,
  Map,
  FOV,
  DIRS,
  Util,
};

// eslint-disable-next-line import/no-default-export
export default Splinter;
