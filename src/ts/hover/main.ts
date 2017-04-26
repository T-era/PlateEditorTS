/// <reference path='../../lib/tools.d.ts' />

module hover {
  export interface Hover {
    /** drawImg と e を渡せば、即ホバーを描画する。e を省略した場合は次のイベントまで描画しない。 **/
    setHoverImage(drawImg :tools.Drawing, e ?:MouseEvent);

    drawAt(e :MouseEvent);
  }
  export function newHover(canvas :HTMLCanvasElement, redraw: () => void) :Hover {
    return new _Hover(canvas, redraw);
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
    drawImg :tools.Drawing;
    redraw :() => void;

    constructor(canvas :HTMLCanvasElement, redraw: () => void) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.redraw = redraw;

      _setEvents(this, canvas);
    }

    setHoverImage(drawImg :tools.Drawing, e ?:MouseEvent) {
      this.drawImg = drawImg;
      this._restore()
      this.drawAt(e);
    }

    drawAt(e :MouseEvent) {
      if (e && this.drawImg) {
        var pointer = tools.toPointer(e, this.canvas);
        this.drawImg(this.context, pointer, HOVERING_CONF);
      }
    }

    _restore() {
      this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
      this.redraw();
    }
  }

  function _setEvents(that :_Hover, canvas :HTMLCanvasElement) {
    canvas.onmousemove = tools.event_chain(canvas.onmousemove, function(e :MouseEvent) {
      if (that.drawImg) {
        var pointer = tools.toPointer(e, canvas);

        that._restore();
        setTimeout(function() {
          that.drawImg(that.context, pointer, HOVERING_CONF);
        }, 0);
      }
    });
    canvas.onmouseout = tools.event_chain(canvas.onmouseout, function(e :MouseEvent) {
      that._restore();
    });
  }
}
