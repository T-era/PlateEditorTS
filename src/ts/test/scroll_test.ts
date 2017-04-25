/// <reference path="../../lib/tools.d.ts" />
/// <reference path="../../lib/scroll.d.ts" />

module scroll_test{
  var scrCnf :scroll.ScrollConfig;
  export function init(id) {
    var cnv = <HTMLCanvasElement>document.getElementById(id);
    var context = cnv.getContext('2d');
    var item = new Item(context);
    var scr = new Scroller(context);
    scrCnf = {
      scroll: scr,
      scrollIn: item,
      viscosity: 0.96
    };
    new scroll.Scroll(cnv, context, scrCnf).redraw();
  }

  class Scroller implements tools.CanvasItem {
    context :CanvasRenderingContext2D;
    pointer = new tools.Pointer(10, 10);
    size = { width: 100, height: 100 };

    constructor(context :CanvasRenderingContext2D) {
      this.context = context;
    }

    redraw() {
      var area = this.size;
      this.context.arc(
          this.pointer.cx + area.width / 2,
          this.pointer.cy + area.height / 2,
          Math.min(area.width, area.height) / 2,
          0, 7);
    }
  }
  class Item implements tools.CanvasItem {
    context :CanvasRenderingContext2D;
    pointer = new tools.Pointer(10, 10);
    size = { width: 150, height: 1000 };

    constructor(context :CanvasRenderingContext2D) {
      this.context = context;
    }

    redraw() {
      var area = this.size;
      tools.rect(this.context , this.pointer, area.width, area.height, {
        strokeColor: new tools.Color(128, 128, 192),
        lineDash: [3,3]
      });
      for (var y = 0; y < area.height; y += 10) {
        tools.line(this.context ,
          new tools.Pointer(this.pointer.cx, this.pointer.cy + y),
          new tools.Pointer(this.pointer.cx + area.width, this.pointer.cy + y), {
            strokeColor: new tools.Color(128, 128, 192),
            lineDash: [3,3]
          });
      }
    }
  }
}
