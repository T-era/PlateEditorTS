/// <reference path='../../lib/tools.d.ts' />

module plates {
  export interface Config {
    unitSize :tools.Size;
    editorSize :tools.Size;
    editorShowSize :tools.Size;
    selections :PlateItem[];
    themeCol :tools.Color;
    scrollFrameStyle :tools.DrawConfig;
    scrollViscosity :number;
  }
}
