import './dist/splinter.js';
import {Game} from './src/Game.js';

const gameWidth = 800;
const gameHeight = 375;
const gameRatio = gameWidth / gameHeight;
function resize() {
  const gameNode = document.getElementById('game');
  gameNode.classList.remove('vertical-constraint', 'horizontal-constraint');
  const windowRatio = window.innerWidth / (window.innerHeight - 120);
  if (windowRatio < 0 || windowRatio > 10) {
    return;
  }
  if (gameRatio < windowRatio) {
    gameNode.classList.add('vertical-constraint');
  } else {
    gameNode.classList.add('horizontal-constraint');
  }
}

new Game();

resize();
addEventListener('resize', () => {
  resize();
});
