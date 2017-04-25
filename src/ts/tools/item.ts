/// <reference path='pos.ts' />

module tools {
  export interface Size {
    width :number;
    height :number;
  }
  /** Canvas内のアイテムが満たすべきI/F **/
  export interface CanvasItem {
    pointer :Pointer;
    size :Size;

    /**
     * このアイテムを再描画します。
     *
     * 基本的にはアイテム全体を描画します。
     * (スクロールなどで)アイテムの一部分を表示したい場合、引数に2点を指定します。
     * この場合は指定された矩形以外の部分は表示しなくても構いません。
     * この仕様は、描画が重い場合のための緩和措置です。もし2点を指定したとしても、全体描画しても大丈夫なようにするべき。
     **/
    redraw(pointer ?:tools.Pointer, size ?:tools.Size);
  }

  /** 指定された座標が、アイテムの上であるかどうか **/
  export function isOn(pos :Pos, item :CanvasItem) :boolean {
    return 0 <= pos.x && pos.x < item.size.width
        && 0 <= pos.y && pos.y < item.size.height;
  }
}
