/// <reference path='../../lib/tools.d.ts' />
/// <reference path='scrollbar.ts' />
/// <reference path='speed.ts' />

module scroll {
  export interface ScrollConfig {
    scroll :tools.CanvasItem;
    scrollIn :tools.CanvasItem;
    viscosity :number;
  }

  export class Scroll implements tools.CanvasItem {
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    config :ScrollConfig;
    pointer :tools.Pointer;
    size :tools.Size;
    scrollingSpeed :Speed;
    scrollStepping :boolean;
    scrollRunning :boolean;
    mousePointer :tools.Pointer;
    limitX :number;
    limitY :number;
    scrollbar :ScrollBar;

    constructor(canvas :HTMLCanvasElement, context :CanvasRenderingContext2D, config :ScrollConfig) {
      this.canvas = canvas;
      this.context = context;
      this.config = config;
      this.pointer = config.scroll.pointer;
      this.size = this.config.scroll.size;
      this.scrollingSpeed = { dx: 0, dy: 0 };
      this.scrollStepping = false;
      this.scrollRunning = false;
      this.mousePointer = new tools.Pointer(0, 0);
      this.limitX = Math.min(0, this.size.width - this.config.scrollIn.size.width);
      this.limitY = Math.min(0, this.size.height - this.config.scrollIn.size.height);
      this.scrollbar = new ScrollBar(context, config, this)

      var that = this;

      canvas.onmousemove = tools.event_chain(canvas.onmousemove, function(e :MouseEvent) {
        var pointer = tools.toPointer(e, canvas);
        if (that.scrollStepping)  {
          that.scrollingSpeed = that.getSpeed(pointer, that.mousePointer);
          that.config.scrollIn.pointer = that.move(that.config.scrollIn.pointer, that.scrollingSpeed);
        }
        that.mousePointer = pointer;
        that.redraw();
      });
      canvas.onmousedown = tools.event_chain(canvas.onmousedown, function(e :MouseEvent) {
        that.scrollStepping = true;
        that.scrollRunning = false;
      });
      canvas.onmouseup = tools.event_chain(canvas.onmouseup, function(e :MouseEvent) {
        that.scrollStepping = false;
        if (that.scrollingSpeed.dx != 0 || that.scrollingSpeed.dy != 0) {
          that.scrollRunning = true;
          that.running();
        }
      });
    }
    getSpeed(current :tools.Pointer, past :tools.Pointer) :Speed {
      var dx = (this.size.width >= this.config.scrollIn.size.width
          ? 0
          : current.cx - past.cx);
      var dy = (this.size.height >= this.config.scrollIn.size.height
          ? 0
          : current.cy - past.cy);
      return { dx: dx, dy: dy };
    }
    running() {
      this.scrollingSpeed = slowDown(this.config, this.scrollingSpeed);
      if (! this.scrollRunning || stopped(this.scrollingSpeed)) {
        this.scrollingSpeed = { dx: 0, dy: 0 };
        this.scrollRunning = false;
        this.redraw();
      } else {
        var that = this;
        setTimeout(function() {
          that.config.scrollIn.pointer = move(that, that.config.scrollIn.pointer, that.scrollingSpeed);
          that.redraw();

          that.running();
        }, 0.2);
      }
    }

    redraw() {
      var p = this.pointer;
      var area = this.size;
      this.context.clearRect(p.cx, p.cy, area.width, area.height);

      this.context.beginPath();
      // clip領域のパスを設定
      this.config.scroll.redraw();
      this.context.save();
      this.context.clip();
      {
        this.context.beginPath();
        this.config.scrollIn.redraw(p, area);
        this.context.stroke();
      }
      this.context.restore();
      if (this.scrollStepping || this.scrollRunning) {
        this.scrollbar.draw();
      }
    }

    speedDown(arg :Speed) :Speed {
      return {
        dx: arg.dx * this.config.viscosity,
        dy: arg.dy * this.config.viscosity
      };
    }
    move(pointer :tools.Pointer, speed :Speed) :tools.Pointer {
      var pos = pointer.at(this);
      var x = Math.max(Math.min(pos.x + speed.dx, 0), this.limitX);
      var y = Math.max(Math.min(pos.y + speed.dy, 0), this.limitY);
      var pos = new tools.Pos(x, y, this);
      return pos.pointer();
    }
  }
}
