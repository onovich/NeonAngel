import { COLORS, GAME_CONFIG, INITIAL_SNAPSHOT } from '../../data/gameConfig.js';
import { clamp, dist, rand } from './math.js';

function drawCircle(ctx, x, y, radius, color, blur = 0, shadowColor = null) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  if (blur > 0) {
    ctx.shadowBlur = blur;
    ctx.shadowColor = shadowColor || color;
    ctx.shadowOffsetY = 5;
  } else {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawRoundedRect(ctx, x, y, width, height, radius, color, blur = 0) {
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, radius);
  ctx.fillStyle = color;
  if (blur > 0) {
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowOffsetY = 5;
  } else {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
  ctx.fill();
  ctx.shadowBlur = 0;
}

class Player {
  constructor(engine) {
    this.engine = engine;
    this.x = engine.width / 2;
    this.y = engine.height * 0.8;
    this.r = GAME_CONFIG.player.radius;
    this.maxHp = GAME_CONFIG.player.maxHp;
    this.hp = this.maxHp;
    this.energy = 0;
    this.invincibleTime = 0;
    this.fireTimer = 0;
  }

  update(dt) {
    const { input, width, height } = this.engine;

    if (input.keyboard.active) {
      const horizontal = Number(input.keyboard.right) - Number(input.keyboard.left);
      const vertical = Number(input.keyboard.down) - Number(input.keyboard.up);
      const magnitude = Math.hypot(horizontal, vertical) || 1;
      const speed = GAME_CONFIG.player.keyboardSpeed * (dt / 16);

      if (horizontal !== 0 || vertical !== 0) {
        this.x += (horizontal / magnitude) * speed;
        this.y += (vertical / magnitude) * speed;
      }
    }

    if (input.active) {
      this.x += (input.x - this.x) * 0.2;
      this.y += (input.y - this.y) * 0.2;
    }

    this.x = clamp(this.x, this.r, width - this.r);
    this.y = clamp(this.y, this.r, height - this.r);

    if (this.invincibleTime > 0) {
      this.invincibleTime -= dt;
    }

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fire();
      this.fireTimer = GAME_CONFIG.player.fireRateMs;
    }

    this.energy = clamp(this.energy, 0, GAME_CONFIG.scoring.maxEnergy);
  }

  fire() {
    this.engine.playerBullets.push(new PlayerBullet(this.engine, this.x - 8, this.y - 10, 0, -GAME_CONFIG.player.bulletSpeed));
    this.engine.playerBullets.push(new PlayerBullet(this.engine, this.x + 8, this.y - 10, 0, -GAME_CONFIG.player.bulletSpeed));
  }

  takeDamage(amount) {
    if (this.invincibleTime > 0) {
      return;
    }

    this.hp -= amount;
    this.invincibleTime = GAME_CONFIG.player.invincibleMs;
    this.engine.triggerShake(300);
    this.engine.createParticles(this.x, this.y, COLORS.player, 10);
    this.engine.emitSnapshot();

    if (this.hp <= 0) {
      this.engine.gameOver();
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.engine.emitSnapshot();
  }

  draw(ctx) {
    const isMaxHp = this.hp >= this.maxHp;

    if (this.invincibleTime > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
      return;
    }

    if (isMaxHp) {
      drawCircle(ctx, this.x, this.y, this.r + 8, 'rgba(253, 255, 182, 0.4)', 20, COLORS.playerAura);
      drawCircle(ctx, this.x, this.y, this.r + 4, 'rgba(253, 255, 182, 0.8)');
    }

    drawCircle(ctx, this.x, this.y, this.r, COLORS.player, 10);
    drawCircle(ctx, this.x, this.y, this.r * 0.4, '#ffffff');
  }
}

class PlayerBullet {
  constructor(engine, x, y, vx, vy) {
    this.engine = engine;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = 6;
    this.birth = Date.now();
    this.canCancel = engine.player.hp >= engine.player.maxHp;
    this.damage = GAME_CONFIG.player.bulletDamage;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * (dt / 16);
    this.y += this.vy * (dt / 16);
    if (this.y < -50) {
      this.dead = true;
    }
  }

  draw(ctx) {
    const age = Date.now() - this.birth;
    const isCancelingActive = this.canCancel
      && age < GAME_CONFIG.player.bulletCancelWindowMs
      && this.engine.player.hp >= this.engine.player.maxHp;

    ctx.beginPath();
    ctx.roundRect(this.x - 3, this.y - 8, 6, 16, 4);

    if (isCancelingActive) {
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLORS.playerBullet;
    } else {
      ctx.fillStyle = COLORS.playerBullet;
      ctx.shadowBlur = 0;
    }

    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class EnemyBullet {
  constructor(x, y, vx, vy, radius = 6, color = COLORS.enemyBullet) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = radius;
    this.color = color;
    this.dead = false;
  }

  update(dt, engine) {
    this.x += this.vx * (dt / 16);
    this.y += this.vy * (dt / 16);
    if (this.y > engine.height + 50 || this.x < -50 || this.x > engine.width + 50) {
      this.dead = true;
    }
  }

  draw(ctx) {
    drawCircle(ctx, this.x, this.y, this.r, this.color, 10);
  }
}

class Enemy {
  constructor(engine, type, x, y) {
    this.engine = engine;
    this.type = type;
    this.x = x;
    this.y = y;
    this.dead = false;
    this.timer = 0;

    switch (type) {
      case 'minion':
        this.r = 18;
        this.hp = 20;
        this.maxHp = 20;
        this.color = COLORS.enemyMinion;
        this.vy = rand(1, 2.5);
        this.vx = rand(-0.5, 0.5);
        this.scoreValue = 10;
        break;
      case 'obstacle':
        this.w = 40;
        this.h = 40;
        this.r = 20;
        this.hp = 99999;
        this.maxHp = this.hp;
        this.color = COLORS.obstacle;
        this.vy = 3;
        this.vx = 0;
        this.scoreValue = 0;
        break;
      case 'elite':
        this.r = 25;
        this.hp = 150;
        this.maxHp = 150;
        this.color = COLORS.enemyElite;
        this.vy = 1;
        this.vx = rand(-1, 1);
        this.scoreValue = 50;
        break;
      case 'boss':
        this.r = 60;
        this.hp = 3000;
        this.maxHp = 3000;
        this.color = COLORS.enemyBoss;
        this.vy = 0;
        this.vx = 2;
        this.targetY = 150;
        this.scoreValue = 500;
        this.phase = 1;
        break;
      default:
        break;
    }
  }

  update(dt) {
    this.timer += dt;
    const { width, height, player, enemyBullets, frameCount } = this.engine;

    if (this.type === 'boss') {
      if (this.y < this.targetY) {
        this.y += 2;
      } else {
        this.x += this.vx;
        if (this.x < this.r || this.x > width - this.r) {
          this.vx *= -1;
        }
      }
    } else {
      this.x += this.vx * (dt / 16);
      this.y += this.vy * (dt / 16);
      if ((this.type === 'minion' || this.type === 'elite') && (this.x < this.r || this.x > width - this.r)) {
        this.vx *= -1;
      }
    }

    if (this.y > height + 100) {
      this.dead = true;
    }

    if (this.type === 'minion' && this.timer > 1500) {
      this.timer = rand(0, 500);
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      const speed = 4;
      enemyBullets.push(new EnemyBullet(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed));
    } else if (this.type === 'elite' && this.timer > 1200) {
      this.timer = 0;
      for (let i = -1; i <= 1; i += 1) {
        const angle = Math.PI / 2 + i * 0.3;
        enemyBullets.push(new EnemyBullet(this.x, this.y + 10, Math.cos(angle) * 4, Math.sin(angle) * 4, 7, COLORS.enemyBullet));
      }
    } else if (this.type === 'boss' && this.y >= this.targetY) {
      if (this.hp < this.maxHp * 0.5) {
        this.phase = 2;
      }

      if (this.phase === 1 && this.timer > 800) {
        this.timer = 0;
        for (let i = 0; i < 12; i += 1) {
          const angle = (i / 12) * Math.PI * 2;
          enemyBullets.push(new EnemyBullet(this.x, this.y, Math.cos(angle) * 3, Math.sin(angle) * 3, 8));
        }
      } else if (this.phase === 2 && this.timer > 100) {
        this.timer = 0;
        const angle = (frameCount * 0.1) % (Math.PI * 2);
        enemyBullets.push(new EnemyBullet(this.x, this.y, Math.cos(angle) * 5, Math.sin(angle) * 5, 8));
        enemyBullets.push(new EnemyBullet(this.x, this.y, Math.cos(angle + Math.PI) * 5, Math.sin(angle + Math.PI) * 5, 8));
      }
    }
  }

  draw(ctx) {
    if (this.type === 'obstacle') {
      drawRoundedRect(ctx, this.x, this.y, this.w, this.h, 8, this.color, 10);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 20px Nunito';
      ctx.fillText('×', this.x, this.y + 2);
      return;
    }

    if (this.type === 'boss') {
      drawCircle(ctx, this.x, this.y, this.r, this.color, 20);
      drawCircle(ctx, this.x, this.y, this.r * 0.7, 'rgba(255,255,255,0.3)');
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.roundRect(this.x - 40, this.y - this.r - 20, 80, 6, 3);
      ctx.fill();
      ctx.fillStyle = COLORS.enemyBoss;
      ctx.beginPath();
      ctx.roundRect(this.x - 40, this.y - this.r - 20, 80 * (this.hp / this.maxHp), 6, 3);
      ctx.fill();
      return;
    }

    drawCircle(ctx, this.x, this.y, this.r, this.color, 10);
    if (this.type === 'elite') {
      drawCircle(ctx, this.x, this.y, this.r * 0.5, '#ffffff');
    }
  }
}

class Drop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = rand(-3, 3);
    this.vy = rand(-3, 1);
    this.r = 6;
    this.timer = 0;
  }

  update(dt, engine) {
    this.timer += dt;
    if (this.timer < 500) {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      return;
    }

    const angle = Math.atan2(engine.player.y - this.y, engine.player.x - this.x);
    const speed = 8;
    this.x += Math.cos(angle) * speed;
    this.y += Math.sin(angle) * speed;
  }

  draw(ctx) {
    drawRoundedRect(ctx, this.x, this.y, 12, 12, 3, COLORS.healthDrop, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x - 1, this.y - 4, 2, 8);
    ctx.fillRect(this.x - 4, this.y - 1, 8, 2);
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = rand(-5, 5);
    this.vy = rand(-5, 5);
    this.life = 1;
    this.color = color;
    this.r = rand(2, 5);
  }

  update(dt) {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= dt * 0.002;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    drawCircle(ctx, this.x, this.y, this.r, this.color);
    ctx.globalAlpha = 1;
  }
}

class UltWave {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.dead = false;
    this.maxRadius = Math.max(width, height) * 1.5;
  }

  update(dt) {
    this.r += 15 * (dt / 16);
    if (this.r > this.maxRadius) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.playerBullet;
    ctx.lineWidth = 10;
    ctx.shadowBlur = 20;
    ctx.shadowColor = COLORS.playerBullet;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(155, 246, 255, 0.2)';
    ctx.fill();
  }
}

class GameEngine {
  constructor({ canvas, container, onSnapshot }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.container = container;
    this.onSnapshot = onSnapshot;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.screen = INITIAL_SNAPSHOT.screen;
    this.finalScore = 0;
    this.reqId = null;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.levelTime = 0;
    this.score = 0;
    this.input = {
      x: -100,
      y: -100,
      active: false,
      keyboard: {
        up: false,
        down: false,
        left: false,
        right: false,
        active: false,
      },
    };
    this.player = new Player(this);
    this.playerBullets = [];
    this.enemies = [];
    this.enemyBullets = [];
    this.drops = [];
    this.particles = [];
    this.ultWaves = [];
    this.shakeTimeout = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.loop = this.loop.bind(this);

    this.bind();
    this.handleResize();
    this.emitSnapshot();
    this.reqId = requestAnimationFrame(this.loop);
  }

  bind() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.container.addEventListener('mousemove', this.handleMove);
    this.container.addEventListener('touchmove', this.handleMove, { passive: false });
    this.container.addEventListener('touchstart', this.handleMove, { passive: false });
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.container.removeEventListener('mousemove', this.handleMove);
    this.container.removeEventListener('touchmove', this.handleMove);
    this.container.removeEventListener('touchstart', this.handleMove);
    if (this.reqId) {
      cancelAnimationFrame(this.reqId);
    }
    if (this.shakeTimeout) {
      window.clearTimeout(this.shakeTimeout);
    }
  }

  handleResize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  handleMove(event) {
    if (event.cancelable) {
      event.preventDefault();
    }
    this.input.active = true;

    if (event.touches && event.touches[0]) {
      this.input.x = event.touches[0].clientX;
      this.input.y = event.touches[0].clientY;
      return;
    }

    this.input.x = event.clientX;
    this.input.y = event.clientY;
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();

    if (key === 'enter') {
      event.preventDefault();
      if (this.screen === 'menu') {
        this.startGame();
      } else if (this.screen === 'over') {
        this.startGame();
      }
      return;
    }

    if (key === ' ' || key === 'spacebar') {
      event.preventDefault();
      this.useUltimate();
      return;
    }

    let handled = true;
    switch (key) {
      case 'w':
      case 'arrowup':
        this.input.keyboard.up = true;
        break;
      case 's':
      case 'arrowdown':
        this.input.keyboard.down = true;
        break;
      case 'a':
      case 'arrowleft':
        this.input.keyboard.left = true;
        break;
      case 'd':
      case 'arrowright':
        this.input.keyboard.right = true;
        break;
      default:
        handled = false;
    }

    if (!handled) {
      return;
    }

    event.preventDefault();
    this.input.active = false;
    this.input.keyboard.active = true;
  }

  handleKeyUp(event) {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'w':
      case 'arrowup':
        this.input.keyboard.up = false;
        break;
      case 's':
      case 'arrowdown':
        this.input.keyboard.down = false;
        break;
      case 'a':
      case 'arrowleft':
        this.input.keyboard.left = false;
        break;
      case 'd':
      case 'arrowright':
        this.input.keyboard.right = false;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.input.keyboard.active = Object.values(this.input.keyboard)
      .slice(0, 4)
      .some(Boolean);
  }

  emitSnapshot() {
    this.onSnapshot({
      screen: this.screen,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      score: this.score,
      energy: this.player.energy,
      finalScore: this.finalScore,
    });
  }

  triggerShake(duration) {
    this.container.classList.add('shake');
    if (this.shakeTimeout) {
      window.clearTimeout(this.shakeTimeout);
    }
    this.shakeTimeout = window.setTimeout(() => {
      this.container.classList.remove('shake');
      this.shakeTimeout = null;
    }, duration);
  }

  resetGameState() {
    this.player = new Player(this);
    this.playerBullets = [];
    this.enemies = [];
    this.enemyBullets = [];
    this.drops = [];
    this.particles = [];
    this.ultWaves = [];
    this.score = 0;
    this.finalScore = 0;
    this.frameCount = 0;
    this.levelTime = 0;
    this.input.active = false;
    this.input.keyboard.up = false;
    this.input.keyboard.down = false;
    this.input.keyboard.left = false;
    this.input.keyboard.right = false;
    this.input.keyboard.active = false;
    this.emitSnapshot();
  }

  startGame() {
    this.screen = 'playing';
    this.input.active = false;
    this.resetGameState();
  }

  gameOver() {
    this.screen = 'over';
    this.finalScore = this.score;
    this.input.active = false;
    this.emitSnapshot();
  }

  useUltimate() {
    if (this.screen !== 'playing' || this.player.energy < GAME_CONFIG.ultimate.cost) {
      return;
    }

    this.player.energy -= GAME_CONFIG.ultimate.cost;
    this.player.invincibleTime = GAME_CONFIG.player.ultimateInvincibleMs;
    this.ultWaves.push(new UltWave(this.player.x, this.player.y, this.width, this.height));
    this.triggerShake(500);
    this.emitSnapshot();
  }

  createParticles(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  spawnLogic() {
    if (this.frameCount % GAME_CONFIG.spawning.minionEveryFrames === 0) {
      this.enemies.push(new Enemy(this, 'minion', rand(50, this.width - 50), -30));
    }

    if (this.score > GAME_CONFIG.spawning.obstacleScoreThreshold && this.frameCount % GAME_CONFIG.spawning.obstacleEveryFrames === 0) {
      this.enemies.push(new Enemy(this, 'obstacle', rand(50, this.width - 50), -50));
    }

    if (this.score > GAME_CONFIG.spawning.eliteScoreThreshold && this.frameCount % GAME_CONFIG.spawning.eliteEveryFrames === 0) {
      this.enemies.push(new Enemy(this, 'elite', rand(50, this.width - 50), -40));
    }

    if (this.score > 0
      && this.score % GAME_CONFIG.spawning.bossScoreStep < 50
      && !this.enemies.some((enemy) => enemy.type === 'boss')) {
      this.enemies.push(new Enemy(this, 'boss', this.width / 2, -100));
    }
  }

  applyDropRewards(enemy) {
    if (enemy.type === 'obstacle') {
      return;
    }

    const distanceToPlayer = dist(this.player, enemy);
    let dropCount = 0;

    for (const rule of GAME_CONFIG.dropsByDistance) {
      if (distanceToPlayer < rule.maxDistance) {
        dropCount = rule.count;
        break;
      }
    }

    if (enemy.type === 'boss') {
      dropCount = 15;
    }

    for (let i = 0; i < dropCount; i += 1) {
      this.drops.push(new Drop(enemy.x, enemy.y));
    }
  }

  updateGame(dt) {
    if (this.screen !== 'playing') {
      return;
    }

    this.frameCount += 1;
    this.levelTime += dt;
    this.player.update(dt);
    this.spawnLogic();

    for (let i = this.ultWaves.length - 1; i >= 0; i -= 1) {
      this.ultWaves[i].update(dt);
      if (this.ultWaves[i].dead) {
        this.ultWaves.splice(i, 1);
      }
    }

    for (let i = this.playerBullets.length - 1; i >= 0; i -= 1) {
      this.playerBullets[i].update(dt);
      if (this.playerBullets[i].dead) {
        this.playerBullets.splice(i, 1);
      }
    }

    for (let i = this.drops.length - 1; i >= 0; i -= 1) {
      const drop = this.drops[i];
      drop.update(dt, this);
      if (dist(this.player, drop) < this.player.r + drop.r) {
        this.player.heal(GAME_CONFIG.drops.healAmount);
        this.player.energy += GAME_CONFIG.drops.energyGain;
        this.drops.splice(i, 1);
        this.emitSnapshot();
      }
    }

    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const enemyBullet = this.enemyBullets[i];
      enemyBullet.update(dt, this);

      let bulletDestroyed = false;
      if (this.player.hp >= this.player.maxHp) {
        for (let j = this.playerBullets.length - 1; j >= 0; j -= 1) {
          const playerBullet = this.playerBullets[j];
          const age = Date.now() - playerBullet.birth;
          if (playerBullet.canCancel && age < GAME_CONFIG.player.bulletCancelWindowMs) {
            if (dist(playerBullet, enemyBullet) < playerBullet.r + enemyBullet.r) {
              this.createParticles(enemyBullet.x, enemyBullet.y, '#ffffff', 3);
              this.playerBullets.splice(j, 1);
              bulletDestroyed = true;
              this.player.energy += GAME_CONFIG.scoring.parryEnergy;
              this.emitSnapshot();
              break;
            }
          }
        }
      }

      if (bulletDestroyed) {
        this.enemyBullets.splice(i, 1);
        continue;
      }

      for (const wave of this.ultWaves) {
        if (dist(enemyBullet, wave) < wave.r) {
          this.createParticles(enemyBullet.x, enemyBullet.y, enemyBullet.color, 2);
          bulletDestroyed = true;
          break;
        }
      }

      if (bulletDestroyed) {
        this.enemyBullets.splice(i, 1);
        continue;
      }

      if (dist(this.player, enemyBullet) < this.player.r * 0.6 + enemyBullet.r) {
        this.player.takeDamage(10);
        this.enemyBullets.splice(i, 1);
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      enemy.update(dt);

      for (const wave of this.ultWaves) {
        if (dist(enemy, wave) < wave.r + enemy.r && enemy.type !== 'obstacle') {
          enemy.hp -= GAME_CONFIG.ultimate.damagePerFrame * (dt / 16);
        }
      }

      for (let j = this.playerBullets.length - 1; j >= 0; j -= 1) {
        const playerBullet = this.playerBullets[j];
        if (enemy.type !== 'obstacle' && dist(playerBullet, enemy) < playerBullet.r + enemy.r) {
          enemy.hp -= playerBullet.damage;
          this.createParticles(playerBullet.x, playerBullet.y, enemy.color, 2);
          this.playerBullets.splice(j, 1);
          if (enemy.hp <= 0) {
            enemy.dead = true;
            break;
          }
        }
      }

      if (dist(this.player, enemy) < this.player.r + enemy.r) {
        this.player.takeDamage(20);
        if (enemy.type === 'minion') {
          enemy.dead = true;
        }
      }

      if (enemy.dead) {
        this.createParticles(enemy.x, enemy.y, enemy.color, enemy.type === 'boss' ? 50 : 10);
        this.score += enemy.scoreValue;
        this.player.energy += enemy.type === 'boss' ? GAME_CONFIG.scoring.bossKillEnergy : GAME_CONFIG.scoring.normalKillEnergy;
        this.applyDropRewards(enemy);
        this.enemies.splice(i, 1);
        this.emitSnapshot();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      this.particles[i].update(dt);
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawGame() {
    const { ctx } = this;
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = 'rgba(0,0,0,0.02)';
    ctx.lineWidth = 1;
    const offset = (this.levelTime * 0.05) % 40;
    ctx.beginPath();
    for (let x = 0; x < this.width; x += 40) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = offset; y < this.height; y += 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    if (this.screen !== 'playing' && this.screen !== 'over') {
      return;
    }

    this.particles.forEach((particle) => particle.draw(ctx));
    this.drops.forEach((drop) => drop.draw(ctx));
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.enemyBullets.forEach((enemyBullet) => enemyBullet.draw(ctx));
    this.playerBullets.forEach((playerBullet) => playerBullet.draw(ctx));
    this.ultWaves.forEach((wave) => wave.draw(ctx));
    this.player.draw(ctx);

    if (this.player.invincibleTime > 900) {
      ctx.fillStyle = 'rgba(255, 173, 173, 0.2)';
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  loop(timestamp) {
    let dt = timestamp - this.lastTime;
    if (dt > 50) {
      dt = 16;
    }
    this.lastTime = timestamp;

    this.updateGame(dt);
    this.drawGame();
    this.reqId = requestAnimationFrame(this.loop);
  }
}

export function createGameEngine(options) {
  return new GameEngine(options);
}