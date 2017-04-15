/// <reference path='../../lib/canvas_tools.d.ts' />

module plates {
  export interface Config {
    iconHeight :number;
    plateWidth :number;
    unitHeight :number;
    selections :PlateItem[];
    editors :EditorConfig[];
  }
  export interface EditorConfig {
    drawIcon :canvas_tools.Drawing;
    themeCol :canvas_tools.Color;
  }
  export class PlateItem implements canvas_tools.CanvasItem {
    drawPath :canvas_tools.Drawing;
    height :number;
    config :Config;
    pointer :canvas_tools.Pointer;
    drawConfig :canvas_tools.DrawConfig;

    constructor(drawPath :canvas_tools.Drawing, config :Config, pointer :canvas_tools.Pointer, height :number, drawConfig? :canvas_tools.DrawConfig) {
      this.drawPath = drawPath;
      this.config = config;
      this.pointer = pointer;
      this.height = height;
      this.drawConfig = drawConfig;
    }
    draw(context :CanvasRenderingContext2D, at :canvas_tools.Pointer, drawConfig? :canvas_tools.DrawConfig) {
      this.drawPath(context, at, canvas_tools.mergeConfig(drawConfig, this.drawConfig));
    }

    isOn(pos :canvas_tools.Pos) :boolean {
      return 0 <= pos.x
        && 0 <= pos.y
        && pos.x <= this.config.plateWidth
        && pos.y <= this.height;
    }
  }
}
