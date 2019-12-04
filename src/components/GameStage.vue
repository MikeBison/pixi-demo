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
      alive: true,
      score: 0
    };
  },
  methods: {
    // 创建需要的元素
    startGame() {
      // 天空（无需改动）
      this.sky = new game.TilingSprite(this.loader.resources['./imgs/sky.png'].texture, this.width, this.height);
      this.sky.position.set(0, 0);
      this.sky.tileScale.set(1, 0.242);
      // 陆地（平移背景图）
      this.land = new game.TilingSprite(this.loader.resources['./imgs/land.png'].texture, this.width, this.height);
      this.land.position.set(0, 68);
      this.land.tileScale.set(0.2, 0.2);
      this.land.zIndex = 5;
      this.land.vx = this.gameSpeed;
      // 远景森林（平移背景图）
      this.tree1 = new game.TilingSprite(this.loader.resources['./imgs/t_1.png'].texture, this.width, this.height);
      this.tree1.position.set(0, 68);
      this.tree1.tileScale.set(0.2, 0.2);
      this.tree1.zIndex = 3;
      this.tree1.vx = this.gameSpeed;
      // 近景森林（平移背景图）
      this.tree2 = new game.TilingSprite(this.loader.resources['./imgs/t_2.png'].texture, this.width, this.height);
      this.tree2.position.set(0, 68);
      this.tree2.tileScale.set(0.2, 0.2);
      this.tree2.zIndex = 1;
      this.tree2.vx = 0.25;
      // 云（平移位置）
      this.cloud1 = new game.Sprite(this.loader.resources['./imgs/c_1.png'].texture);
      this.cloud1.width = 260;
      this.cloud1.height = 210;
      this.cloud1.position.set(this.width / 2, this.height * 0.17);
      this.cloud1.vx = this.gameSpeed;
      // 云（平移位置）
      this.cloud2 = new game.Sprite(this.loader.resources['./imgs/c_2.png'].texture);
      this.cloud2.width = 500;
      this.cloud2.height = 300;
      this.cloud2.position.set(0, 0);
      this.cloud2.vx = 0.25;
      // 云（平移位置）
      this.cloud3 = new game.Sprite(this.loader.resources['./imgs/c_3.png'].texture);
      this.cloud3.width = 300;
      this.cloud3.height = 250;
      this.cloud3.position.set(130, 50);
      this.cloud3.vx = 0.1;
      // 主角，站立状态
      this.actor = new game.AnimatedSprite(this.loader.resources['./imgs/stand.json'].spritesheet.animations.idle);
      this.actor.position.set(50, this.height - 100);
      this.actor.animationSpeed = 0.4;
      this.actor.play();
      // 主角，跑，跳状态，通过切换播放的动画实现
      this.actorRunning = new game.AnimatedSprite(
        this.loader.resources['./imgs/actor.json'].spritesheet.animations.run
      );
      this.actorRunning.vy = 0;
      this.actorRunning.ay = 0;
      this.actorRunning.position.set(50, this.height - 100);
      this.actorRunning.animationSpeed = this.runSpeed;
      this.actorRunning.play();
      // 分数文本
      let textStyle = new game.TextStyle({
        fontFamily: 'Victorian LET',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        fill: ['#ffffff', '#ffffff']
      });
      this.scoreSprite = new game.Text(`score ${this.score}`, textStyle);
      this.scoreSprite.x = this.width - this.scoreSprite.width - 6;
      this.scoreSprite.y = 3;
      // 开始文本
      let startTextStyle = new game.TextStyle({
        fontFamily: 'Victorian LET',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'right',
        fill: ['#ffffff', '#ffffff']
      });
      this.startText = new game.Text(`Press Space Key To Start`, startTextStyle);
      this.startText.x = this.width / 2 - this.startText.width / 2;
      this.startText.y = this.height / 2 - this.startText.height / 2 - 40;
      // gameover 文本
      let endTextStyle = new game.TextStyle({
        fontFamily: 'Victorian LET',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'right',
        fill: ['#ffffff', '#ffffff']
      });

      this.endText = new game.Text(`GAME OVER`, endTextStyle);
      this.endText.x = this.width / 2 - this.endText.width / 2;
      this.endText.y = this.height / 2 - this.endText.height / 2 - 40;
      this.endText.visible = false;
      // gameover 文本2
      let endTextStyle2 = new game.TextStyle({
        fontFamily: 'Victorian LET',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        fill: ['#ffffff', '#ffffff']
      });

      this.endText2 = new game.Text(`Your score is ${this.score}`, endTextStyle2);
      this.endText2.x = this.width / 2 - this.endText2.width / 2;
      this.endText2.y = this.endText.y + this.endText.height + 6;
      this.endText2.visible = false;
      // gameover 文本3
      let endTextStyle3 = new game.TextStyle({
        fontFamily: 'Victorian LET',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        fill: ['#ffffff', '#ffffff']
      });

      this.endText3 = new game.Text(`Press Space Key To Reset`, endTextStyle3);
      this.endText3.x = this.width / 2 - this.endText3.width / 2;
      this.endText3.y = this.endText2.y + this.endText2.height + 6;
      this.endText3.visible = false;
      // 将所有元素加入舞台
      this.stage.addChild(
        this.sky,
        this.tree2,
        this.tree1,
        this.land,
        this.cloud1,
        this.cloud2,
        this.cloud3,
        this.actor,
        this.scoreSprite,
        this.startText,
        this.endText,
        this.endText2,
        this.endText3
      );
      // 注册键盘事件
      window.addEventListener('keydown', this.keydown);
    },
    // 键盘操作
    keydown() {
      if (window.event.keyCode === 32) {
        if (!this.alive) {
          // 死亡重开
          return this.resetGame();
        }
        if (!this.start) {
          // 未开始时开始
          this.start = true;
          this.stage.removeChild(this.actor);
          this.stage.addChild(this.actorRunning);
          this.runGame();
          this.startText.visible = false;
        } else {
          // 开始时跳跃
          if (!this.jumping) {
            this.jump();
          }
        }
      }
    },
    // 跳跃位置计算，动画替换
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
    // 平移传入的精灵，类型为Sprite
    cloudRun(cloud) {
      if (cloud === null || cloud === undefined) {
        return;
      }
      cloud.x -= cloud.vx;
      if (cloud.x < 0 - cloud.width) {
        cloud.x = this.width;
      }
    },
    // 平移传入的背景，类型为TilingSprite
    bgRun(bg) {
      if (bg === null || bg === undefined) {
        return;
      }
      bg.tilePosition.x -= bg.vx;
    },
    // 跳跃位置计算
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
    // 碰撞检测
    checkDectesion() {
      let keys = Object.keys(this.monsters);
      keys.map(index => {
        let monster = this.monsters[index];
        if (monster && game.hitTestRectangle(monster, this.actorRunning)) {
          this.alive = false;
          this.endText.visible = true;
          this.endText2.text = `Your score is ${this.score}`;
          this.endText2.x = this.width / 2 - this.endText2.width / 2;
          this.endText2.visible = true;
          this.endText3.visible = true;
        }
      });
    },
    // 计算得分
    scoreCalc() {
      this.scoreInterval = setInterval(() => {
        this.score += 2;
      }, 100);
    },
    // 创建怪物
    createMonster() {
      if (this.start) {
        let time = game.getRandomNum(3, 15) * 1000;
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
    // 展示计算好的分数
    showScore() {
      this.scoreSprite.x = this.width - this.scoreSprite.width - 6;
      this.scoreSprite.text = `score ${this.score}`;
    },
    // 刷新界面
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
        this.scoreCalc();
        this.createMonster();
        this.monsterCreating = true;
      }
      this.showScore();
      this.checkDectesion();
    },
    // 计算怪物位置
    monsterRunning() {
      for (let key in this.monsters) {
        let item = this.monsters[key];
        item.x += item.vx;
        if (item.x <= 0 - item.width) {
          delete this.monsters[key];
        }
      }
    },
    // gameloop
    runGame() {
      if (this.alive) {
        this.action();
        requestAnimationFrame(this.runGame);
      }
    },
    // 删除过场的怪物
    removeMonsters() {
      for (let key in this.monsters) {
        this.stage.removeChild(this.monsters[key]);
        delete this.monsters[key];
      }
      this.monsterNum = 0;
      this.monsterCreating = false;
      clearTimeout(this.monsterTimer);
    },
    // 重置游戏数据
    resetGame() {
      this.stage.removeChild(this.actorRunning);
      this.stage.addChild(this.actor);
      this.removeMonsters();
      this.land = null;
      this.sky = null;
      this.cloud1 = null;
      this.cloud2 = null;
      this.cloud3 = null;
      this.tree1 = null;
      this.tree2 = null;
      this.tree3 = null;
      this.alive = true;
      this.start = false;
      this.jumping = false;
      this.score = 0;
      clearInterval(this.scoreInterval);
      window.removeEventListener('keydown', this.keydown);
      this.startGame();
    }
  },
  // 初始化舞台
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
  // dom挂载后挂载生成的pixijs canvas
  mounted() {
    this.app.view.style.transform = 'scale(2)';
    this.app.view.style.transformOrigin = '0 0';
    document.getElementById('gameStage').appendChild(this.app.view);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
