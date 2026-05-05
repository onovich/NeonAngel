import { COLORS, GAME_CONFIG, INITIAL_SNAPSHOT, WEAPON_DEFS } from '../../data/gameConfig.js';
import { clamp, dist, rand } from './math.js';

const WEAPON_ORDER = ['lance', 'spread', 'pulse'];

class HitRipple {
  constructor(x, y, color, maxRadius, lineWidth = 6) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 6;
    this.maxRadius = maxRadius;
    this.lineWidth = lineWidth;
    this.life = 1;
  }

  update(dt) {
    this.radius += 0.45 * dt;
    this.life -= dt * 0.0035;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.color;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  get dead() {
    return this.life <= 0 || this.radius >= this.maxRadius;
  }
}

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

    if (input.touch.active) {
      const moveDeltaX = input.touch.moveDeltaX;
      const moveDeltaY = input.touch.moveDeltaY;
      const drift = Math.hypot(moveDeltaX, moveDeltaY);

      if (drift > GAME_CONFIG.player.touchDeadzone) {
        this.x += moveDeltaX * GAME_CONFIG.player.touchMoveScale;
        this.y += moveDeltaY * GAME_CONFIG.player.touchMoveScale;
      }

      input.touch.moveDeltaX = 0;
      input.touch.moveDeltaY = 0;
    }

    this.x = clamp(this.x, this.r, width - this.r);
    this.y = clamp(this.y, this.r, height - this.r);

    if (this.invincibleTime > 0) {
      this.invincibleTime -= dt;
    }

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fire();
      this.fireTimer = this.engine.getCurrentWeaponProfile().rateMs;
    }

    this.energy = clamp(this.energy, 0, GAME_CONFIG.scoring.maxEnergy);
  }

  fire() {
    const weaponProfile = this.engine.getCurrentWeaponProfile();

    weaponProfile.bullets.forEach((bulletPattern) => {
      const speed = bulletPattern.speed ?? weaponProfile.speed;
      const angle = bulletPattern.angle ?? 0;
      const vx = Math.sin(angle) * speed;
      const vy = -Math.cos(angle) * speed;
      this.engine.playerBullets.push(new PlayerBullet(this.engine, {
        x: this.x + bulletPattern.offsetX,
        y: this.y - 10,
        vx,
        vy,
        radius: bulletPattern.radius ?? weaponProfile.radius,
        damage: bulletPattern.damage ?? weaponProfile.damage,
        pierce: bulletPattern.pierce ?? weaponProfile.pierce,
        color: weaponProfile.color,
      }));
    });
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
  constructor(engine, { x, y, vx, vy, radius, damage, pierce, color }) {
    this.engine = engine;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = radius;
    this.birth = Date.now();
    this.canCancel = engine.player.hp >= engine.player.maxHp;
    this.damage = damage;
    this.pierce = pierce;
    this.color = color;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * (dt / 16);
    this.y += this.vy * (dt / 16);
    if (this.y < -80 || this.x < -80 || this.x > this.engine.width + 80) {
      this.dead = true;
    }
  }

  draw(ctx) {
    const age = Date.now() - this.birth;
    const isCancelingActive = this.canCancel
      && age < GAME_CONFIG.player.bulletCancelWindowMs
      && this.engine.player.hp >= this.engine.player.maxHp;

    ctx.beginPath();

    if (isCancelingActive) {
      ctx.fillStyle = '#CFF8FF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(2, this.r * 0.28);
      ctx.shadowBlur = 18;
      ctx.shadowColor = this.color;
    } else {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = 'transparent';
      ctx.lineWidth = 0;
      ctx.shadowBlur = 0;
    }

    if (this.r >= 9) {
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    } else {
      ctx.roundRect(this.x - this.r * 0.45, this.y - this.r * 1.4, this.r * 0.9, this.r * 2.8, this.r * 0.6);
    }

    ctx.fill();
    if (isCancelingActive) {
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.lineWidth = 0;
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
        this.hp = 26;
        this.maxHp = 26;
        this.color = COLORS.enemyMinion;
        this.vy = rand(1.6, 3);
        this.vx = rand(-0.9, 0.9);
        this.scoreValue = 10;
        this.experienceValue = GAME_CONFIG.progression.normalKillXp;
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
        this.experienceValue = 0;
        break;
      case 'elite':
        this.r = 25;
        this.hp = 190;
        this.maxHp = 190;
        this.color = COLORS.enemyElite;
        this.vy = 1.4;
        this.vx = rand(-1.4, 1.4);
        this.scoreValue = 80;
        this.experienceValue = GAME_CONFIG.progression.eliteKillXp;
        break;
      case 'boss':
        this.r = 60;
        this.hp = 3600;
        this.maxHp = 3600;
        this.color = COLORS.enemyBoss;
        this.vy = 0;
        this.vx = 2;
        this.targetY = 150;
        this.scoreValue = 500;
        this.phase = 1;
        this.experienceValue = GAME_CONFIG.progression.bossKillXp;
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
  constructor(x, y, color, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx ?? rand(-5, 5);
    this.vy = options.vy ?? rand(-5, 5);
    this.life = options.life ?? 1;
    this.color = color;
    this.r = options.radius ?? rand(2, 5);
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
    this.progression = {
      level: 0,
      xp: 0,
      pendingLevelUps: 0,
      nextLevelXp: GAME_CONFIG.progression.baseLevelXp,
    };
    this.arsenal = {
      currentWeapon: 'lance',
      rewardCursor: 1,
      unlocked: {
        lance: true,
        spread: false,
        pulse: false,
      },
      levels: {
        lance: 0,
        spread: 0,
        pulse: 0,
      },
    };
    this.weaponToast = null;
    this.pendingReward = null;
    this.input = {
      keyboard: {
        up: false,
        down: false,
        left: false,
        right: false,
        active: false,
      },
      touch: {
        active: false,
        identifier: null,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        currentX: 0,
        currentY: 0,
        moveDeltaX: 0,
        moveDeltaY: 0,
      },
    };
    this.player = new Player(this);
    this.playerBullets = [];
    this.enemies = [];
    this.enemyBullets = [];
    this.drops = [];
    this.particles = [];
    this.hitRipples = [];
    this.ultWaves = [];
    this.shakeTimeout = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
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
    this.container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.container.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('touchcancel', this.handleTouchEnd);
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

  getTrackedTouch(event) {
    if (this.input.touch.identifier === null) {
      return event.touches[0] || event.changedTouches[0] || null;
    }

    return [...event.touches, ...event.changedTouches].find((touch) => touch.identifier === this.input.touch.identifier) || null;
  }

  handleTouchStart(event) {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (this.input.touch.active) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    this.input.touch.active = true;
    this.input.touch.identifier = touch.identifier;
    this.input.touch.startX = touch.clientX;
    this.input.touch.startY = touch.clientY;
    this.input.touch.lastX = touch.clientX;
    this.input.touch.lastY = touch.clientY;
    this.input.touch.currentX = touch.clientX;
    this.input.touch.currentY = touch.clientY;
    this.input.touch.moveDeltaX = 0;
    this.input.touch.moveDeltaY = 0;
  }

  handleTouchMove(event) {
    if (event.cancelable) {
      event.preventDefault();
    }

    const touch = this.getTrackedTouch(event);
    if (!touch || !this.input.touch.active) {
      return;
    }

    this.input.touch.moveDeltaX += touch.clientX - this.input.touch.lastX;
    this.input.touch.moveDeltaY += touch.clientY - this.input.touch.lastY;
    this.input.touch.lastX = touch.clientX;
    this.input.touch.lastY = touch.clientY;
    this.input.touch.currentX = touch.clientX;
    this.input.touch.currentY = touch.clientY;
  }

  handleTouchEnd(event) {
    if (event.cancelable) {
      event.preventDefault();
    }

    const touch = this.getTrackedTouch(event);
    if (!touch) {
      return;
    }

    this.resetTouchInput();
  }

  resetTouchInput() {
    this.input.touch.active = false;
    this.input.touch.identifier = null;
    this.input.touch.startX = 0;
    this.input.touch.startY = 0;
    this.input.touch.lastX = 0;
    this.input.touch.lastY = 0;
    this.input.touch.currentX = 0;
    this.input.touch.currentY = 0;
    this.input.touch.moveDeltaX = 0;
    this.input.touch.moveDeltaY = 0;
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();

    if (key === 'enter') {
      event.preventDefault();
      if (this.pendingReward) {
        this.confirmRewardSelection();
        return;
      }
      if (this.screen === 'menu') {
        this.startGame();
      } else if (this.screen === 'over') {
        this.startGame();
      }
      return;
    }

    if (this.pendingReward) {
      if (key === '1') {
        event.preventDefault();
        this.selectRewardOption(0);
        return;
      }

      if (key === '2') {
        event.preventDefault();
        this.selectRewardOption(1);
        return;
      }

      if (key === 'q' || key === 'arrowleft') {
        event.preventDefault();
        this.pendingReward.selectionIndex = 0;
        this.emitSnapshot();
        return;
      }

      if (key === 'e' || key === 'arrowright') {
        event.preventDefault();
        this.pendingReward.selectionIndex = 1;
        this.emitSnapshot();
        return;
      }
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
    const currentWeapon = this.getCurrentWeaponState();
    this.onSnapshot({
      screen: this.screen,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      score: this.score,
      level: this.progression.level,
      xp: this.progression.xp,
      nextLevelXp: this.progression.nextLevelXp,
      energy: this.player.energy,
      finalScore: this.finalScore,
      weaponName: currentWeapon.label,
      weaponLevel: currentWeapon.level,
      weaponToast: this.weaponToast,
      rewardOptions: this.pendingReward?.options ?? null,
      rewardSelection: this.pendingReward?.selectionIndex ?? 0,
    });
  }

  buildRewardOption(weaponId) {
    const weaponDef = WEAPON_DEFS[weaponId];
    const currentLevel = this.arsenal.levels[weaponId];
    const maxLevel = weaponDef.levels.length - 1;

    if (!this.arsenal.unlocked[weaponId]) {
      return {
        kind: 'unlock',
        weaponId,
        title: `${weaponDef.label} Unlock`,
        detail: `Switch to ${weaponDef.label} and start at Lv.1`,
      };
    }

    if (currentLevel < maxLevel) {
      return {
        kind: 'upgrade',
        weaponId,
        title: `${weaponDef.label} Upgrade`,
        detail: `Raise to Lv.${currentLevel + 1}`,
      };
    }

    return {
      kind: 'overdrive',
      weaponId,
      title: `${weaponDef.label} Overdrive`,
      detail: 'Recover 12 HP and gain 35 energy',
    };
  }

  getNextLevelXp(level) {
    return GAME_CONFIG.progression.baseLevelXp + level * GAME_CONFIG.progression.levelXpStep;
  }

  addExperience(amount) {
    if (amount <= 0) {
      return;
    }

    this.progression.xp += amount;

    while (this.progression.xp >= this.progression.nextLevelXp) {
      this.progression.xp -= this.progression.nextLevelXp;
      this.progression.level += 1;
      this.progression.pendingLevelUps += 1;
      this.progression.nextLevelXp = this.getNextLevelXp(this.progression.level);
    }

    if (!this.pendingReward && this.progression.pendingLevelUps > 0) {
      this.queueLevelReward();
    } else {
      this.emitSnapshot();
    }
  }

  queueLevelReward() {
    const currentWeaponId = this.arsenal.currentWeapon;
    const candidates = WEAPON_ORDER
      .map((weaponId) => ({
        weaponId,
        score: (!this.arsenal.unlocked[weaponId] ? 100 : 0)
          + (weaponId !== currentWeaponId ? 20 : 0)
          + (WEAPON_DEFS[weaponId].levels.length - 1 - this.arsenal.levels[weaponId]) * 10,
      }))
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.weaponId);

    const optionWeaponIds = [];
    for (const weaponId of candidates) {
      if (!optionWeaponIds.includes(weaponId)) {
        optionWeaponIds.push(weaponId);
      }
      if (optionWeaponIds.length === 2) {
        break;
      }
    }

    this.pendingReward = {
      options: optionWeaponIds.map((weaponId) => this.buildRewardOption(weaponId)),
      selectionIndex: 0,
    };
    this.progression.pendingLevelUps = Math.max(0, this.progression.pendingLevelUps - 1);
    this.player.invincibleTime = Math.max(this.player.invincibleTime, GAME_CONFIG.feedback.rewardPauseInvincibleMs);
    this.resetTouchInput();
    this.emitSnapshot();
  }

  applyRewardOption(option) {
    const weaponDef = WEAPON_DEFS[option.weaponId];
    this.arsenal.currentWeapon = option.weaponId;

    if (option.kind === 'unlock') {
      this.arsenal.unlocked[option.weaponId] = true;
      this.arsenal.levels[option.weaponId] = 1;
      this.triggerWeaponToast('Weapon Shift', `${weaponDef.label} unlocked`);
      return;
    }

    if (option.kind === 'upgrade') {
      this.arsenal.levels[option.weaponId] += 1;
      this.triggerWeaponToast('Weapon Upgrade', `${weaponDef.label} Lv.${this.arsenal.levels[option.weaponId]}`);
      return;
    }

    this.player.heal(12);
    this.player.energy = clamp(this.player.energy + 35, 0, GAME_CONFIG.scoring.maxEnergy);
    this.triggerWeaponToast('Weapon Overdrive', `${weaponDef.label} surge`);
  }

  selectRewardOption(index) {
    if (!this.pendingReward) {
      return;
    }
    this.pendingReward.selectionIndex = clamp(index, 0, this.pendingReward.options.length - 1);
    this.emitSnapshot();
  }

  confirmRewardSelection() {
    if (!this.pendingReward) {
      return;
    }
    const option = this.pendingReward.options[this.pendingReward.selectionIndex];
    this.pendingReward = null;
    this.resetTouchInput();
    this.applyRewardOption(option);
    if (this.progression.pendingLevelUps > 0) {
      this.queueLevelReward();
      return;
    }
    this.emitSnapshot();
  }

  getDifficultyPressure() {
    const minutes = this.levelTime / 60000;
    return 1 + minutes * GAME_CONFIG.spawning.pressurePerMinute + this.score * GAME_CONFIG.spawning.pressurePerScore;
  }

  triggerWeaponToast(title, detail) {
    this.weaponToast = {
      title,
      detail,
      expiresAt: Date.now() + GAME_CONFIG.feedback.weaponToastMs,
    };
    this.emitSnapshot();
  }

  getCurrentWeaponState() {
    const weaponId = this.arsenal.currentWeapon;
    return {
      id: weaponId,
      label: WEAPON_DEFS[weaponId].label,
      level: this.arsenal.levels[weaponId],
      unlocked: this.arsenal.unlocked[weaponId],
    };
  }

  getCurrentWeaponProfile() {
    const weaponState = this.getCurrentWeaponState();
    const weaponDef = WEAPON_DEFS[weaponState.id];
    const level = clamp(weaponState.level, 0, weaponDef.levels.length - 1);
    return {
      ...weaponDef.levels[level],
      color: weaponDef.color,
      label: weaponDef.label,
      level,
    };
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
    this.progression.level = 0;
    this.progression.xp = 0;
    this.progression.pendingLevelUps = 0;
    this.progression.nextLevelXp = GAME_CONFIG.progression.baseLevelXp;
    this.weaponToast = null;
    this.pendingReward = null;
    this.arsenal.currentWeapon = 'lance';
    this.arsenal.unlocked.lance = true;
    this.arsenal.unlocked.spread = false;
    this.arsenal.unlocked.pulse = false;
    this.arsenal.levels.lance = 0;
    this.arsenal.levels.spread = 0;
    this.arsenal.levels.pulse = 0;
    this.input.keyboard.up = false;
    this.input.keyboard.down = false;
    this.input.keyboard.left = false;
    this.input.keyboard.right = false;
    this.input.keyboard.active = false;
    this.resetTouchInput();
    this.emitSnapshot();
  }

  startGame() {
    this.screen = 'playing';
    this.resetGameState();
  }

  gameOver() {
    this.screen = 'over';
    this.finalScore = this.score;
    this.resetTouchInput();
    this.emitSnapshot();
  }

  useUltimate() {
    if (this.screen !== 'playing' || this.pendingReward || this.player.energy < GAME_CONFIG.ultimate.cost) {
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

  createBloomHitEffect(bullet, enemy) {
    const baseAngle = Math.atan2(bullet.vy, bullet.vx);
    for (let i = -3; i <= 3; i += 1) {
      const angle = baseAngle + i * 0.22;
      const speed = 2.4 + Math.abs(i) * 0.45;
      this.particles.push(new Particle(enemy.x, enemy.y, bullet.color, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: rand(2, 4),
        life: 0.85,
      }));
    }
  }

  createPulseHitEffect(bullet, enemy) {
    this.hitRipples.push(new HitRipple(enemy.x, enemy.y, bullet.color, 42, 5));
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      const speed = 2.1 + rand(0.2, 1.1);
      this.particles.push(new Particle(enemy.x, enemy.y, bullet.color, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: rand(2, 3),
        life: 0.75,
      }));
    }
  }

  createWeaponHitEffect(bullet, enemy) {
    const currentWeaponId = this.arsenal.currentWeapon;
    if (currentWeaponId === 'spread') {
      this.createBloomHitEffect(bullet, enemy);
      return;
    }

    if (currentWeaponId === 'pulse') {
      this.createPulseHitEffect(bullet, enemy);
      return;
    }

    this.createParticles(bullet.x, bullet.y, enemy.color, 2);
  }

  spawnLogic() {
    const pressure = this.getDifficultyPressure();
    const minionEveryFrames = Math.max(
      GAME_CONFIG.spawning.minionMinFrames,
      Math.floor(GAME_CONFIG.spawning.minionEveryFrames / pressure),
    );
    const obstacleEveryFrames = Math.max(
      GAME_CONFIG.spawning.obstacleMinFrames,
      Math.floor(GAME_CONFIG.spawning.obstacleEveryFrames / pressure),
    );
    const eliteEveryFrames = Math.max(
      GAME_CONFIG.spawning.eliteMinFrames,
      Math.floor(GAME_CONFIG.spawning.eliteEveryFrames / pressure),
    );

    if (this.frameCount % minionEveryFrames === 0) {
      this.enemies.push(new Enemy(this, 'minion', rand(50, this.width - 50), -30));
    }

    if (this.score > GAME_CONFIG.spawning.obstacleScoreThreshold && this.frameCount % obstacleEveryFrames === 0) {
      this.enemies.push(new Enemy(this, 'obstacle', rand(50, this.width - 50), -50));
    }

    if (this.score > GAME_CONFIG.spawning.eliteScoreThreshold && this.frameCount % eliteEveryFrames === 0) {
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

    if (this.pendingReward) {
      if (this.weaponToast && Date.now() >= this.weaponToast.expiresAt) {
        this.weaponToast = null;
        this.emitSnapshot();
      }
      return;
    }

    this.frameCount += 1;
    this.levelTime += dt;
    if (this.weaponToast && Date.now() >= this.weaponToast.expiresAt) {
      this.weaponToast = null;
      this.emitSnapshot();
    }
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
        this.player.takeDamage(GAME_CONFIG.combat.bulletHitDamage);
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
          this.createWeaponHitEffect(playerBullet, enemy);
          if (playerBullet.pierce > 0) {
            playerBullet.pierce -= 1;
          } else {
            this.playerBullets.splice(j, 1);
          }
          if (enemy.hp <= 0) {
            enemy.dead = true;
            break;
          }
        }
      }

      if (dist(this.player, enemy) < this.player.r + enemy.r) {
        this.player.takeDamage(GAME_CONFIG.combat.bodyHitDamage);
        if (enemy.type === 'minion') {
          enemy.dead = true;
        }
      }

      if (enemy.dead) {
        this.createParticles(enemy.x, enemy.y, enemy.color, enemy.type === 'boss' ? 50 : 10);
        this.score += enemy.scoreValue;
        this.player.energy += enemy.type === 'boss' ? GAME_CONFIG.scoring.bossKillEnergy : GAME_CONFIG.scoring.normalKillEnergy;
        this.addExperience(enemy.experienceValue);
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

    for (let i = this.hitRipples.length - 1; i >= 0; i -= 1) {
      this.hitRipples[i].update(dt);
      if (this.hitRipples[i].dead) {
        this.hitRipples.splice(i, 1);
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
    this.hitRipples.forEach((ripple) => ripple.draw(ctx));
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