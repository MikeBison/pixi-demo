import * as PIXI from 'pixi.js'

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

let Container = PIXI.Container,
    Renderer = PIXI.autoDetectRenderer,
    Loader = PIXI.Loader,
    TilingSprite = PIXI.TilingSprite,
    Sprite = PIXI.Sprite,
    Application = PIXI.Application,
    AnimatedSprite = PIXI.AnimatedSprite

export default {
  Container,
  Renderer,
  Loader,
  TilingSprite,
  Application,
  Sprite,
  AnimatedSprite
}