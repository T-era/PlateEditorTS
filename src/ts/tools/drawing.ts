/// <reference path='helpers.ts' />

module tools {
  export interface Drawing {
    (context :CanvasRenderingContext2D, pointer :Pointer, config :DrawConfig);
  }
}
