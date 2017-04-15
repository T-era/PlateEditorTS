/// <reference path='helpers.ts' />

module canvas_tools {
  export interface Drawing {
    (context :CanvasRenderingContext2D, pointer :Pointer, config? :DrawConfig);
  }
}
