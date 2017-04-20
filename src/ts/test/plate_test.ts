/// <reference path='../../lib/tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='../../lib/plates.d.ts' />

module plate_test {
  export function init() {
    var canvas = <HTMLCanvasElement>document.getElementById('canvas_test');
    var context = canvas.getContext('2d');
    var config = {
      unitWidth: 25,
      unitHeight: 15,
      editorWidth: 100,
      editorHeight: 1200,
      selections: [],
      themeCol: new tools.Color(0, 128, 0)
    };
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
      config);
  }
  function rect(c, p :tools.Pointer, config :tools.DrawConfig) {
    c.beginPath();
    tools.fillRect(c, new tools.Pointer(p.cx + 1, p.cy + 1), 48, 28, config);
    tools.rect(c, new tools.Pointer(p.cx + 1, p.cy + 1), 48, 28, config);
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
