/// <reference path='color.ts' />

module canvas_tools {
  export interface Shadow {
    blur :number;
    offsetX :number;
    offsetY :number;
  }
  export interface DrawConfig {
    lineWidth? :number;
    lineDash? :number[];
    color? :Color;
    shadow? :Shadow;
  }
  var DEFAULT :DrawConfig = {
    lineWidth: 1,
    lineDash: [],
    color: BLACK,
    shadow: {
      blur: 0,
      offsetX: 0,
      offsetY: 0 } };

  function completeDefault(config :DrawConfig) :DrawConfig {
    return mergeConfig(config, DEFAULT);
  }
  export function mergeConfig(a :DrawConfig, b :DrawConfig) :DrawConfig {
    if (! a && ! b) {
      return DEFAULT;
    } else if (! a) {
      return b;
    } else if (! b) {
      return a;
    } else {
      return {
        lineWidth: getValue('lineWidth'),
        lineDash: getValue('lineDash'),
        color: getValue('color'),
        shadow: getValue('shadow') }
    }

    function getValue(propName :string) :any {
      return (a.hasOwnProperty(propName)
          ? a[propName]
          : b[propName]);
    }
  }
  function apply(context :CanvasRenderingContext2D, config? :DrawConfig) {
    var ex = completeDefault(config);
    context.lineWidth = ex.lineWidth;
    context.setLineDash(ex.lineDash);
    if (ex.shadow) {
      context.shadowColor = ex.color.toString();
      context.shadowBlur = ex.shadow.blur;
      context.shadowOffsetX = ex.shadow.offsetX;
      context.shadowOffsetY = ex.shadow.offsetY;
    }
    context.strokeStyle = ex.color.toString();
  }

  export function line(context :CanvasRenderingContext2D, from :Pointer, to :Pointer, config? :DrawConfig) {
    apply(context, config);
    context.moveTo(from.cx, from.cy);
    context.lineTo(to.cx, to.cy);
  }
  export function circle(context :CanvasRenderingContext2D, center :Pointer, r :number, config? :DrawConfig) {
    apply(context, config);
    context.arc(center.cx, center.cy, r, 0, 2 * Math.PI, false);
  }
}
