export const COLORS = {
  bg: '#F8F9FA',
  player: '#A8E6CF',
  playerAura: '#FDFFB6',
  playerBullet: '#9BF6FF',
  enemyMinion: '#FFADAD',
  enemyElite: '#FFD6A5',
  enemyBoss: '#BDB2FF',
  enemyBullet: '#FFC6FF',
  healthDrop: '#CAFFBF',
  obstacle: '#9A8C98',
  text: '#6C757D',
};

export const GAME_CONFIG = {
  player: {
    radius: 16,
    maxHp: 100,
    keyboardSpeed: 7.5,
    touchSpeed: 7.5,
    touchDeadzone: 12,
    touchMaxDrift: 72,
    fireRateMs: 120,
    invincibleMs: 1000,
    ultimateInvincibleMs: 3000,
    bulletDamage: 10,
    bulletCancelWindowMs: 1000,
    bulletSpeed: 15,
  },
  drops: {
    healAmount: 5,
    energyGain: 5,
  },
  scoring: {
    normalKillEnergy: 15,
    bossKillEnergy: 50,
    parryEnergy: 1,
    maxEnergy: 300,
  },
  ultimate: {
    cost: 100,
    damagePerFrame: 200,
  },
  spawning: {
    minionEveryFrames: 60,
    obstacleEveryFrames: 200,
    eliteEveryFrames: 300,
    obstacleScoreThreshold: 500,
    eliteScoreThreshold: 1000,
    bossScoreStep: 3000,
  },
  dropsByDistance: [
    { maxDistance: 100, count: 5 },
    { maxDistance: 200, count: 3 },
    { maxDistance: 400, count: 1 },
  ],
};

export const INITIAL_SNAPSHOT = {
  screen: 'menu',
  hp: GAME_CONFIG.player.maxHp,
  maxHp: GAME_CONFIG.player.maxHp,
  score: 0,
  energy: 0,
  finalScore: 0,
};