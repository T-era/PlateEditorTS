/// <reference path='../../lib/canvas_tools.d.ts' />

module plates {
  export interface Config {
    unitWidth :number;
    unitHeight :number;
    editorWidth :number;
    editorHeight :number;
    selections :PlateItem[];
    themeCol :canvas_tools.Color;
  }
  export class PlateItem implements canvas_tools.CanvasItem {
    drawPath :canvas_tools.Drawing;
    width :number;
    height :number;
    pointer :canvas_tools.Pointer;
    drawConfig :canvas_tools.DrawConfig;

    constructor(drawPath :canvas_tools.Drawing, pointer :canvas_tools.Pointer, width :number, height :number, drawConfig? :canvas_tools.DrawConfig) {
      this.drawPath = drawPath;
      this.pointer = pointer;
      this.width = width
      this.height = height;
      this.drawConfig = drawConfig;
    }
    draw(context :CanvasRenderingContext2D, at :canvas_tools.Pointer, drawConfig? :canvas_tools.DrawConfig) {
      this.drawPath(context, at, canvas_tools.mergeConfig(drawConfig, this.drawConfig));
    }

    isOn(pos :canvas_tools.Pos) :boolean {
      return 0 <= pos.x && pos.x <= this.width
          && 0 <= pos.y && pos.y <= this.height;
    }
  }
}
