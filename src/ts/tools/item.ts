/// <reference path='pos.ts' />

module tools {
  export interface Size {
    width :number;
    height :number;
  }
  // Canvas内のアイテムが満たすべきI/F
  export interface CanvasItem {
    pointer :Pointer;
    size :Size;
    redraw();
  }

  // 指定された座標が、アイテムの上であるかどうか
  export function isOn(pos :Pos, item :CanvasItem) :boolean {
    return 0 <= pos.x && pos.x < item.size.width
        && 0 <= pos.y && pos.y < item.size.height;
  }
}
