/// <reference path='../../lib/canvas_tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='../../lib/plates.d.ts' />

module test {
  export function init() {
    var config = {
      plateWidth: 50,
      unitHeight: 15,
      selections: [],
      editors: [
        { themeCol: new canvas_tools.Color(0, 128, 0) },
        { themeCol: new canvas_tools.Color(128, 128, 255) }
      ] };
    config.selections = [
        new plates.PlateItem(crcl, config, new canvas_tools.Pointer(150, 100), 30, {
          color: new canvas_tools.Color(0, 255, 255)
        }),
        new plates.PlateItem(crss, config, new canvas_tools.Pointer(150, 200), 30, {
          color: new canvas_tools.Color(255, 128, 128)
        })];

    new plates.PlateEditor(
      <HTMLCanvasElement>document.getElementById('canvas_test'),
      config);
  }
  function rect(c, p :canvas_tools.Pointer, config :canvas_tools.DrawConfig) {
    c.beginPath();
    canvas_tools.rect(c, p, 50, 30, config);
    c.stroke();
  }
  var SLCT_CONF = { lineWidth: 3 };
  function crcl(c, p :canvas_tools.Pointer, config :canvas_tools.DrawConfig) {
    c.beginPath();
    canvas_tools.circle(c,
        new canvas_tools.Pointer(25 + p.cx, 15 + p.cy),
        10,
        config);
    c.stroke();
  }
  function crss(c, p :canvas_tools.Pointer, config :canvas_tools.DrawConfig) {
    c.beginPath();
    canvas_tools.line(c,
        new canvas_tools.Pointer(p.cx + 15, p.cy + 5),
        new canvas_tools.Pointer(p.cx + 35, p.cy + 25),
        SLCT_CONF);
    canvas_tools.line(c,
        new canvas_tools.Pointer(p.cx + 35, p.cy + 5),
        new canvas_tools.Pointer(p.cx + 15, p.cy + 25),
        config);
    c.stroke();
  }
}
