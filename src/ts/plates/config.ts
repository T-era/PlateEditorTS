/// <reference path='../../lib/tools.d.ts' />

module plates {
  export interface Config {
    unitSize :tools.Size;
    editorSize :tools.Size;
    editorShowSize :tools.Size;
    selections :PlateItem[];
    themeCol :tools.Color;
    scrollFrameStyle :tools.DrawConfig;
  }
  export class PlateItem implements tools.CanvasItem {
    context :CanvasRenderingContext2D;
    drawPath :tools.Drawing;
    size :tools.Size;
    pointer :tools.Pointer;
    drawConfig :tools.DrawConfig;

    constructor(context :CanvasRenderingContext2D, drawPath :tools.Drawing, pointer :tools.Pointer, size :tools.Size, drawConfig? :tools.DrawConfig) {
      this.context = context;
      this.drawPath = drawPath;
      this.pointer = pointer;
      this.size = size;
      this.drawConfig = drawConfig;
    }
    draw(at :tools.Pointer, drawConfig? :tools.DrawConfig) {
      this.drawPath(this.context, at, tools.mergeConfig(drawConfig, this.drawConfig));
    }

    redraw() {
      this.drawPath(this.context, this.pointer, this.drawConfig);
    }
  }
}
