import * as PIXI from 'pixi.js'

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

let Container = PIXI.Container,
    Renderer = PIXI.autoDetectRenderer,
    Loader = PIXI.Loader,
    TilingSprite = PIXI.TilingSprite,
    Sprite = PIXI.Sprite,
    Application = PIXI.Application,
    AnimatedSprite = PIXI.AnimatedSprite,
    Rectangle = PIXI.Rectangle,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle

let getRandomNum = (min, max) => {
  let num = Math.random() * (max - min) + min
  return Math.floor(num)
}

let hitTestRectangle = (r1, r2) => {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

export default {
  Container,
  Renderer,
  Loader,
  TilingSprite,
  Application,
  Sprite,
  AnimatedSprite,
  getRandomNum,
  Rectangle,
  hitTestRectangle,
  Text,
  TextStyle
}