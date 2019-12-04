<template>
  <div class="game-stage" id="gameStage"></div>
</template>

<script>
import game from './gameUtils/game';
export default {
  name: 'GameStage',
  props: {},
  data() {
    return {
      windowHeight: window.innerHeight,
      width: 667,
      height: 375,
      imgs: [
        './imgs/sky.png',
        './imgs/c_1.png',
        './imgs/c_2.png',
        './imgs/c_3.png',
        './imgs/land.png',
        './imgs/t_1.png',
        './imgs/t_2.png',
        './imgs/stand.json',
        './imgs/actor.json',
        './imgs/rino.json'
      ],
      actroVy: -6,
      gameSpeed: 1,
      start: false,
      runSpeed: 0.2,
      jumpSpeed: 0.1,
      actroAy: 0.2,
      monsterCreating: false,
      monsters: {},
      monsterNum: 0,
      level: 1,
      monsterVx: 0.1,
      alive: true
    };
  },
  methods: {
    startGame() {
      this.sky = new game.TilingSprite(this.loader.resources['./imgs/sky.png'].texture, this.width, this.height);
      this.sky.position.set(0, 0);
      this.sky.tileScale.set(1, 0.242);

      this.land = new game.TilingSprite(this.loader.resources['./imgs/land.png'].texture, this.width, this.height);
      this.land.position.set(0, 68);
      this.land.tileScale.set(0.2, 0.2);
      this.land.zIndex = 5;
      this.land.vx = this.gameSpeed;

      this.tree1 = new game.TilingSprite(this.loader.resources['./imgs/t_1.png'].texture, this.width, this.height);
      this.tree1.position.set(0, 68);
      this.tree1.tileScale.set(0.2, 0.2);
      this.tree1.zIndex = 3;
      this.tree1.vx = this.gameSpeed;

      this.tree2 = new game.TilingSprite(this.loader.resources['./imgs/t_2.png'].texture, this.width, this.height);
      this.tree2.position.set(0, 68);
      this.tree2.tileScale.set(0.2, 0.2);
      this.tree2.zIndex = 1;
      this.tree2.vx = 0.25;

      this.cloud1 = new game.Sprite(this.loader.resources['./imgs/c_1.png'].texture);
      this.cloud1.width = 260;
      this.cloud1.height = 210;
      this.cloud1.position.set(this.width / 2, this.height * 0.17);
      this.cloud1.vx = this.gameSpeed;

      this.cloud2 = new game.Sprite(this.loader.resources['./imgs/c_2.png'].texture);
      this.cloud2.width = 500;
      this.cloud2.height = 300;
      this.cloud2.position.set(0, 0);
      this.cloud2.vx = 0.25;

      this.cloud3 = new game.Sprite(this.loader.resources['./imgs/c_3.png'].texture);
      this.cloud3.width = 300;
      this.cloud3.height = 250;
      this.cloud3.position.set(130, 50);
      this.cloud3.vx = 0.1;

      this.actor = new game.AnimatedSprite(this.loader.resources['./imgs/stand.json'].spritesheet.animations.idle);
      this.actor.position.set(50, this.height - 100);
      this.actor.animationSpeed = 0.4;
      this.actor.play();

      this.actorRunning = new game.AnimatedSprite(
        this.loader.resources['./imgs/actor.json'].spritesheet.animations.run
      );
      this.actorRunning.vy = 0;
      this.actorRunning.ay = 0;
      this.actorRunning.position.set(50, this.height - 100);
      this.actorRunning.animationSpeed = this.runSpeed;
      this.actorRunning.play();

      this.stage.addChild(
        this.sky,
        this.tree2,
        this.tree1,
        this.land,
        this.cloud1,
        this.cloud2,
        this.cloud3,
        this.actor
      );
      window.addEventListener('keydown', this.keydown);
    },
    keydown () {
      if (!this.alive) {
        return this.resetGame()
      }
      if (window.event.charCode === 0 && !this.start) {
        this.start = true;
        this.stage.removeChild(this.actor);
        this.stage.addChild(this.actorRunning);
        this.runGame();
      } else {
        if (!this.jumping) {
          this.jump();
        }
      }
    },
    jump() {
      // 变更动画
      this.actorRunning.textures = this.loader.resources['./imgs/actor.json'].spritesheet.animations.jump;
      this.actorRunning.loop = false;
      this.actorRunning.animationSpeed = this.jumpSpeed;
      this.actorRunning.play();
      this.jumping = true;
      this.actorRunning.vy = this.actroVy;
      this.actorRunning.ay = this.actroAy;
    },
    cloudRun(cloud) {
      if (cloud === null || cloud === undefined) {
        return
      }
      cloud.x -= cloud.vx;
      if (cloud.x < 0 - cloud.width) {
        cloud.x = this.width;
      }
    },
    bgRun(bg) {
      if (bg === null || bg === undefined) {
        return
      }
      bg.tilePosition.x -= bg.vx;
    },
    jumpPosition() {
      this.actorRunning.y += this.actorRunning.vy;
      this.actorRunning.vy += this.actorRunning.ay;
      if (this.actorRunning.y > this.height - 100) {
        this.actorRunning.vy = 0;
        this.actorRunning.ay = 0;
        this.actorRunning.y = this.height - 100;

        this.actorRunning.loop = true;
        this.actorRunning.textures = this.loader.resources['./imgs/actor.json'].spritesheet.animations.run;
        this.actorRunning.animationSpeed = this.runSpeed;
        this.actorRunning.play();
        this.jumping = false;
      }
    },
    hit (monstPosObj) {
      let ifhit = (monstPosObj.leftTop.x >= this.actorRunning.x && monstPosObj.leftTop.x <= this.actorRunning.x + this.actorRunning.width && monstPosObj.leftTop.y >= this.actorRunning.y + this.actorRunning.height && monstPosObj.leftTop.y <= this.actorRunning.y) || 
      (monstPosObj.leftBottom.x >= this.actorRunning.x && monstPosObj.leftBottom.x <= this.actorRunning.x + this.actorRunning.width && monstPosObj.leftBottom.y >= this.actorRunning.y + this.actorRunning.height && monstPosObj.leftBottom.y <= this.actorRunning.y) || 
      (monstPosObj.rightBottom.x >= this.actorRunning.x && monstPosObj.rightBottom.x <= this.actorRunning.x + this.actorRunning.width && monstPosObj.rightBottom.y >= this.actorRunning.y + this.actorRunning.height && monstPosObj.rightBottom.y <= this.actorRunning.y) || 
      (monstPosObj.rightTop.x >= this.actorRunning.x && monstPosObj.rightTop.x <= this.actorRunning.x + this.actorRunning.width && monstPosObj.rightTop.y >= this.actorRunning.y + this.actorRunning.height && monstPosObj.rightTop.y <= this.actorRunning.y)
      return ifhit
    },
    checkDectesion () {
      let keys = Object.keys(this.monsters)
      keys.map((index) => {
        let monster = this.monsters[index]
        if (monster && game.hitTestRectangle(monster,this.actorRunning)) {
          this.alive = false
        }
      })
    },
    createMonster() {
      if (this.start) {  
        let time = game.getRandomNum(3, 4) * 1000
        this.monsterTimer = setTimeout(() => {
          let monster = new game.AnimatedSprite(
            this.loader.resources['./imgs/rino.json'].spritesheet.animations['Run (52x34)']
          );
          monster.animationSpeed = this.runSpeed;
          monster.play();
          monster.position.set(this.width, this.height - 93);
          monster.scale.set(0.8, 0.8);
          monster.vx = 0 - (this.gameSpeed + 1 + this.monsterVx * this.level);
          this.stage.addChild(monster);
          this.monsters[this.monsterNum] = monster;
          this.monsterNum += 1;

          this.createMonster();
        }, time);
      }
    },
    action() {
      this.cloudRun(this.cloud1);
      this.cloudRun(this.cloud2);
      this.cloudRun(this.cloud3);
      this.bgRun(this.land);
      this.bgRun(this.tree1);
      this.bgRun(this.tree2);
      this.jumpPosition();
      this.monsterRunning();
      if (!this.monsterCreating) {
        this.createMonster();
        this.monsterCreating = true;
      }
      this.checkDectesion()
    },
    monsterRunning() {
      for (let key in this.monsters) {
        let item = this.monsters[key];
        item.x += item.vx;
        if (item.x <= 0 - item.width) {
          delete this.monsters[key];
        }
      }
    },
    runGame() {
      this.action();
      if (this.alive) {
        requestAnimationFrame(this.runGame);
      }
    },
    removeMonsters () {
      for (let key in this.monsters) {
        this.stage.removeChild(this.monsters[key])
        delete this.monsters[key];
      }
      this.monsterNum = 0
      this.monsterCreating = false
      clearTimeout(this.monsterTimer)
    },
    resetGame () {
      this.stage.removeChild(this.actorRunning);
      this.stage.addChild(this.actor);
      this.removeMonsters()
      this.land = null
      this.sky = null
      this.cloud1 = null
      this.cloud2 = null
      this.cloud3 = null
      this.tree1 = null
      this.tree2 = null
      this.tree3 = null
      this.alive = true
      this.start = false
      window.removeEventListener('keydown', this.keydown)
      this.startGame()
    }
  },
  created() {
    this.app = new game.Application({
      width: this.width,
      height: this.height,
      transparent: false
      // view: document.getElementById('game')
    });
    this.renderer = this.app.renderer;
    this.stage = this.app.stage;
    this.loader = new game.Loader();
    this.loader.add(this.imgs).load(this.startGame);
  },
  mounted() {
    this.app.view.style.transform = 'scale(2)';
    this.app.view.style.transformOrigin = '0 0';
    document.getElementById('gameStage').appendChild(this.app.view);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
