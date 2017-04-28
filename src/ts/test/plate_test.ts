/// <reference path='../../lib/tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='../../lib/plates.d.ts' />

module plate_test {
  var TURN_R = 20;
  var sqrt2 = Math.sqrt(2);

  export function init(canvasId) {
    var canvas = <HTMLCanvasElement>document.getElementById(canvasId);
    var context = canvas.getContext('2d');
    var config = {
      unitSize: { width: 25, height: 15 },
      editorSize: { width: 100, height: 1200 },
      editorShowSize: {width: 100, height: 100 },
      selections: [],
      themeCol: new tools.Color(0, 128, 0),
      scrollFrameStyle: { alpha: 0 },
      scrollViscosity: 0.95 };
    config.selections = [
        new plates.PlateItem(context, withGrid(rightArrow), new tools.Pointer(150, 30), { width: 50, height: 30 }, {
          strokeColor: new tools.Color(0, 0, 255),
          fillColor: new tools.Color(64, 64, 255)
        }),
        new plates.PlateItem(context, withGrid(leftArrow), new tools.Pointer(150, 70), { width: 50, height: 30 }, {
          strokeColor: new tools.Color(0, 192, 0),
          fillColor: new tools.Color(64, 255, 64)
        })];

    var pe = new plates.PlateEditor(
      canvas,
      config);
    pe.redraw();
  }
  function rect(c, p :tools.Pointer, config :tools.DrawConfig) {
    tools.fillRect(c, new tools.Pointer(p.cx + 1, p.cy + 1), { width: 48, height: 28 }, config);
    tools.rect(c, new tools.Pointer(p.cx + 1, p.cy + 1), { width: 48, height: 28 }, config);
  }
  function withGrid(f) {
    return function(c, p :tools.Pointer, config :tools.DrawConfig) {
      var LW = 2;
      var DD = 1 + LW;
      var lineStyle = tools.mergeConfig({
        lineWidth: LW * 2,
        lineJoin: 'round'
      }, config);
      tools.fillRect(c,
          new tools.Pointer(p.cx + DD, p.cy + DD),
          { width: 50 - 2 * DD, height: 30 - 2 * DD },
          config);
      tools.draw(c, lineStyle, function() {
        c.moveTo(p.cx + DD, p.cy + DD);
        c.lineTo(p.cx + 50 - DD, p.cy + DD);
        c.lineTo(p.cx + 50 - DD, p.cy + 30 - DD);
        c.lineTo(p.cx + DD, p.cy + 30 - DD);
        c.lineTo(p.cx + DD, p.cy + DD);
      });
      f(c, p, lineStyle);
    };
  }

  function rightArrow(c, p :tools.Pointer, config :tools.DrawConfig) {
    var cx = (p.cx + 25) + TURN_R*7/8;
    var cy = (p.cy + 15) + TURN_R*1/2;
    var arrowHeadX = cx - TURN_R*sqrt2/2;
    var arrowHeadY = cy - TURN_R*sqrt2/2;
    tools.draw(c, config, function() {
      c.arc(cx, cy, TURN_R, Math.PI, Math.PI*5/4);
      c.moveTo(arrowHeadX, arrowHeadY);
      c.lineTo(arrowHeadX - 10, arrowHeadY);
      c.moveTo(arrowHeadX, arrowHeadY);
      c.lineTo(arrowHeadX +3, arrowHeadY +9);
    });
  }
  function leftArrow(c, p :tools.Pointer, config :tools.DrawConfig) {
    var cx = (p.cx + 25) - TURN_R*7/8;
    var cy = (p.cy + 15) + TURN_R*1/2;
    var arrowHeadX = cx + TURN_R*sqrt2/2;
    var arrowHeadY = cy - TURN_R*sqrt2/2;
    tools.draw(c, config, function() {
      c.arc(cx, cy, TURN_R, 0, - Math.PI*1/4, true);
      c.moveTo(arrowHeadX, arrowHeadY);
      c.lineTo(arrowHeadX +10, arrowHeadY);
      c.moveTo(arrowHeadX, arrowHeadY);
      c.lineTo(arrowHeadX -3, arrowHeadY +9);
    });
  }

  function crcl(c, p :tools.Pointer, config :tools.DrawConfig) {
    tools.circle(c,
        new tools.Pointer(25 + p.cx, 15 + p.cy),
        10,
        config);
  }
  function crss(c, p :tools.Pointer, config :tools.DrawConfig) {
    tools.line(c,
        new tools.Pointer(p.cx + 15, p.cy + 5),
        new tools.Pointer(p.cx + 35, p.cy + 25),
        config);
    tools.line(c,
        new tools.Pointer(p.cx + 35, p.cy + 5),
        new tools.Pointer(p.cx + 15, p.cy + 25),
        config);
  }
}
