/// <reference path='../../lib/tools.d.ts' />

module hover {
  export interface DrawHover {
    hover :tools.Drawing;
    width :number;
    height :number;
  }

  export interface Hover {
    /** drawImg と e を渡せば、即ホバーを描画する。e を省略した場合は次のイベントまで描画しない。 **/
    setHoverImage(drawImg :DrawHover, e :MouseEvent, drawNew :(context :CanvasRenderingContext2D)=>void);

    drawAt(e :MouseEvent, drawNew :(context :CanvasRenderingContext2D)=>void);
  }
  export function newHover(canvas :HTMLCanvasElement) :Hover {
    return new _Hover(canvas);
  }
  var HOVERING_CONF :tools.DrawConfig = {
    alpha: 0.8,
    shadow: {
      blur: 3,
      offsetX: 3,
      offsetY: 5 }};

  class _Hover implements Hover {
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    drawImg :DrawHover;
    redraw :(context :CanvasRenderingContext2D) => void;

    constructor(canvas :HTMLCanvasElement) {
      this.canvas = canvas;
      this.context = <CanvasRenderingContext2D>canvas.getContext('2d');
      this.redraw = function(c) {};

      _setEvents(this, canvas);
    }

    setHoverImage(drawImg :DrawHover, e :MouseEvent, drawNew :(context :CanvasRenderingContext2D)=>void) {
      this.drawImg = drawImg;
      this.drawAt(e, drawNew);
    }

    drawAt(e :MouseEvent, drawNew :(context :CanvasRenderingContext2D)=>void) {
      if (e && this.drawImg) {
        this.redraw(this.context);
        var pointer = tools.toPointer(e, this.canvas);
        var that = this;
        var left = pointer.cx - that.drawImg.width / 2;
        var top = pointer.cy - that.drawImg.height / 2;
        var width = that.drawImg.width;
        var height = that.drawImg.height;
        drawNew(that.context);
        var imgData = that.context.getImageData(
            left,
            top,
            width,
            height);

        this.redraw = function(context) {
          //that.context.clearRect(left, top, that.drawImg.width, that.drawImg.height);
          context.putImageData(
              imgData,
              left,
              top);
        };
        this.drawImg.hover(this.context, pointer, HOVERING_CONF);
      } else {
        this.redraw = function(ctx) {};
      }
    }
  }

  function _setEvents(that :_Hover, canvas :HTMLCanvasElement) {
    canvas.onmousemove = tools.event_chain(canvas.onmousemove, function(e :MouseEvent) {
      that.drawAt(e, function(context) {});
    });
    canvas.onmouseout = tools.event_chain(canvas.onmouseout, function(e :MouseEvent) {
      that.redraw(that.context);
    });
  }
}
