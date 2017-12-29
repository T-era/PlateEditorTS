/// <reference path="../../lib/tools.d.ts" />
/// <reference path="../../lib/hover.d.ts" />

module hov_test{
  export function init() {
    var cnv = <HTMLCanvasElement>document.getElementById('canvas_test');
    var hov = hover.newHover(cnv);
    var myHover = {
      hover: drawHover,
      width: 52,
      height: 32
    };
    hov.setHoverImage(myHover);
    var tmp;
    cnv.onclick = function(e :MouseEvent) {
      hov.setHoverImage(tmp ? myHover : null, e);
      tmp = ! tmp;
    }
    var context = cnv.getContext('2d');
    context.strokeStyle = 'red';
    context.moveTo(0,0);
    context.lineTo(100,100);
    context.stroke();
  }
  function drawHover(c :CanvasRenderingContext2D, p :tools.Pointer) {
    c.strokeStyle = '#cfc'; c.strokeRect(p.cx - 25, p.cy - 15, 50, 30);
  }
}
