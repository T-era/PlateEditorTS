/// <reference path='../../lib/tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='../../lib/plates.d.ts' />
/// <reference path='../../lib/scroll.d.ts' />

module plate_scroll_test {
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
        new plates.PlateItem(context, rect, new tools.Pointer(150, 100), { width: 50, height: 30 }, {
          strokeColor: new tools.Color(64, 128, 128),
          fillColor: new tools.Color(192, 255, 255)
        }),
        new plates.PlateItem(context, crss, new tools.Pointer(150, 200), { width: 50, height: 30 }, {
          strokeColor: new tools.Color(192, 128, 128)
        })];

    new plates.PlateEditor(
      canvas,
      config).redraw();
  }
  function rect(c, p :tools.Pointer, config :tools.DrawConfig) {
    c.beginPath();
    tools.fillRect(c, new tools.Pointer(p.cx + 1, p.cy + 1), { width: 48, height: 28 }, config);
    tools.rect(c, new tools.Pointer(p.cx + 1, p.cy + 1), { width: 48, height: 28 }, config);
    c.stroke();
  }
  function crcl(c, p :tools.Pointer, config :tools.DrawConfig) {
    c.beginPath();
    tools.circle(c,
        new tools.Pointer(25 + p.cx, 15 + p.cy),
        10,
        config);
    c.stroke();
  }
  function crss(c, p :tools.Pointer, config :tools.DrawConfig) {
    c.beginPath();
    tools.line(c,
        new tools.Pointer(p.cx + 15, p.cy + 5),
        new tools.Pointer(p.cx + 35, p.cy + 25),
        config);
    tools.line(c,
        new tools.Pointer(p.cx + 35, p.cy + 5),
        new tools.Pointer(p.cx + 15, p.cy + 25),
        config);
    c.stroke();
  }
}
