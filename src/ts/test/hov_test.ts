/// <reference path="../../lib/tools.d.ts" />
/// <reference path="../../lib/hover.d.ts" />

module hov_test{
  export function init() {
     var cnv = <HTMLCanvasElement>document.getElementById('canvas_test');
     var hov = hover.newHover(cnv, function() {});
     hov.setHoverImage(function(c :CanvasRenderingContext2D, p :tools.Pointer) {
       c.strokeStyle = '#cfc'; c.strokeRect(p.cx - 25, p.cy - 15, 50, 30);
     });
     var tmp;
     cnv.onclick = function(e :MouseEvent) {
       hov.setHover(tmp, e);
       tmp = ! tmp;
     }
   }
}
