import * as ROT from 'rot-js';
import {Modal} from './Modal.js';
import * as util from './utils.js';

const {DIRS, FOV, RNG, Map, Display, Scheduler, Path} = ROT;
const Util = util;
const Splinter = {
  Display,
  Modal,
  Scheduler,
  RNG,
  Map,
  FOV,
  Path,
  DIRS,
  Util,
};

// eslint-disable-next-line import/no-default-export
export default Splinter;
