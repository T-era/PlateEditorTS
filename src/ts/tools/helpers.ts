/// <reference path='color.ts' />

module tools {
  export interface Shadow {
    color ?:Color;
    blur :number;
    offsetX :number;
    offsetY :number;
  }
  export interface DrawConfig {
    lineWidth ?:number;
    lineCap ?:string;
    lineDash ?:number[];
    strokeColor ?:Color;
    fillColor ?:Color;
    alpha ?:number;
    shadow ?:Shadow;
  }
  var DEFAULT :DrawConfig = {
    lineWidth: 1,
    lineCap: 'butt',
    lineDash: [],
    strokeColor: BLACK,
    fillColor: BLACK,
    alpha: 1.0,
    shadow: {
      color: null,
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
        lineCap: getValue('lineCap'),
        lineDash: getValue('lineDash'),
        strokeColor: getValue('strokeColor'),
        fillColor: getValue('fillColor'),
        alpha: getValue('alpha'),
        shadow: getValue('shadow') }
    }

    function getValue(propName :string) :any {
      return ((a.hasOwnProperty(propName) && a[propName] != null)  // undefined or null
          ? a[propName]
          : b[propName]);
    }
  }
  function apply(context :CanvasRenderingContext2D, config? :DrawConfig) {
    var ex = completeDefault(config);
    context.lineWidth = ex.lineWidth;
    context.lineCap = ex.lineCap;
    context.setLineDash(ex.lineDash);
    if (ex.shadow) {
      if (ex.shadow.color) {
        context.shadowColor = ex.shadow.color.toString();
      } else {
        context.shadowColor = ex.fillColor.darken().toString();
      }
      context.shadowBlur = ex.shadow.blur;
      context.shadowOffsetX = ex.shadow.offsetX;
      context.shadowOffsetY = ex.shadow.offsetY;
    }
    context.globalAlpha = ex.alpha;
    context.strokeStyle = ex.strokeColor.toString();
    context.fillStyle = ex.fillColor.toString();
  }

  export function line(context :CanvasRenderingContext2D, from :Pointer, to :Pointer, config :DrawConfig) {
    apply(context, config);
    context.moveTo(from.cx, from.cy);
    context.lineTo(to.cx, to.cy);
  }
  export function circle(context :CanvasRenderingContext2D, center :Pointer, r :number, config :DrawConfig) {
    apply(context, config);
    context.arc(center.cx, center.cy, r, 0, 2 * Math.PI, false);
  }
  export function rect(context :CanvasRenderingContext2D, leftTop :Pointer, size :Size, config :DrawConfig) {
    apply(context, config);
    context.rect(leftTop.cx, leftTop.cy, size.width, size.height);
  }
  export function fillRect(context :CanvasRenderingContext2D, leftTop :Pointer, size :Size, config :DrawConfig) {
    apply(context, config);
    context.fillRect(leftTop.cx, leftTop.cy, size.width, size.height);
  }
}
