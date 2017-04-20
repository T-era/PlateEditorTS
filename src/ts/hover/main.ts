/// <reference path='../../lib/tools.d.ts' />

module hover {
  export interface Hover {
    setHoverImage(drawImg :tools.Drawing);
    setHover(hovering :boolean);
    save();
    update<T>(f :() => T) :T;
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
    isHovering :boolean = true;
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    drawImg :tools.Drawing;
    savePoint :ImageData;

    constructor(canvas :HTMLCanvasElement) {
      var that = this;
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.save();

      canvas.onmousemove = function(e :MouseEvent) {
        if (that.isHovering && that.drawImg) {
          var pointer = tools.toPointer(e, canvas);

          that._restore();
          that.drawImg(that.context, pointer, HOVERING_CONF);
        }
      }
      canvas.onmouseout = function(e :MouseEvent) {
        that._restore();
      }
    }

    setHoverImage(drawImg :tools.Drawing) {
      this.drawImg = drawImg;
      this._restore();
    }
    setHover(hovering :boolean) {
      this.isHovering = hovering;
      if (this.isHovering) {
        // TODO Draw (or not necessary?)
      } else {
        this._restore()
      }
    }

    save() {
      var canvas = this.canvas;
      var context = this.context;
      this.savePoint = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    _restore() {
      this.context.putImageData(this.savePoint, 0, 0);
    }
    update(f :() => void) {
      this._restore();
      var ret = f();
      this.save();
      return ret;
    }
  }
}
