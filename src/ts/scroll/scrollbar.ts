/// <reference path='../../lib/tools.d.ts' />

module scroll {
  var SCROLLBAR_STYLE = {
    lineWidth: 3,
    lineCap: 'round',
    color: new tools.Color(128, 128, 128),
    alpha: 0.5
  };

  export class ScrollBar {
    context :CanvasRenderingContext2D;
    private _horizontal :_ScrollBar;
    private _vertical :_ScrollBar;

    constructor(context :CanvasRenderingContext2D, config :ScrollConfig, owner :tools.CanvasItem) {
      var size = owner.size;
      this.context = context;
      this._horizontal = new _ScrollBar(
        size.width - 3,
        function(x, min, max) {
          context.beginPath();
          tools.line(context, new tools.Pos(x, min + 2, owner).pointer(), new tools.Pos(x, max + 2, owner).pointer(), SCROLLBAR_STYLE);
          context.stroke();
        },
        function() { return config.scroll.pointer.cy; },
        function() { return config.scrollIn.pointer.cy; },
        function() { return size.height; },
        function() { return config.scrollIn.size.height; });
      this._vertical = new _ScrollBar(
        size.height - 3,
        function(y, min, max) {
          context.beginPath();
          tools.line(context, new tools.Pos(min + 2, y, owner).pointer(), new tools.Pos(max + 2, y, owner).pointer(), SCROLLBAR_STYLE);
          context.stroke();
        },
        function() { return config.scroll.pointer.cx; },
        function() { return config.scrollIn.pointer.cx; },
        function() { return size.width; },
        function() { return config.scrollIn.size.width; });
    }
    draw() {
      this._horizontal.draw();
      this._vertical.draw();
    }
  }

  class _ScrollBar {
    anotherAxis :number;
    howDraw :(a :number, min :number, max :number) => void;
    howGetMotherAt :() => number;
    howGetChildAt :() => number;
    howGetSizeAt :() => number;
    howGetChildSizeAt :() => number;

    constructor(
        anotherAxis :number,
        howDraw :(a :number, min :number, max :number) => void,
        howGetMotherAt :() => number,
        howGetChildAt :() => number,
        howGetSizeAt :() => number,
        howGetChildSizeAt :() => number) {
      this.anotherAxis = anotherAxis;
      this.howDraw = howDraw;
      this.howGetMotherAt = howGetMotherAt;
      this.howGetChildAt = howGetChildAt;
      this.howGetSizeAt = howGetSizeAt;
      this.howGetChildSizeAt = howGetChildSizeAt;
    }
    draw() {
      var sizeAt = this.howGetSizeAt();
      var lMin = this.howGetMotherAt() - this.howGetChildAt();
      var lMax = lMin + sizeAt;
      var childSizeAt = this.howGetChildSizeAt();
      var min = lMin * (sizeAt - 4) / childSizeAt;  // 両端2づつは、lineCapが消費する。
      var max = lMax * (sizeAt - 4) / childSizeAt;  // 両端2づつは、lineCapが消費する。
      if (lMax < childSizeAt) {
        this.howDraw(this.anotherAxis, min, max);
      }
    }
  }
}
