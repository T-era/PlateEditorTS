module canvas_tools {
  // Canvas内のアイテムが満たすべきI/F TODO 不要？？
  export interface CanvasItem {
    pointer :canvas_tools.Pointer;
    // 指定された座標が、このアイテムの上であるかどうか
    isOn(pos :canvas_tools.Pos) :boolean;
  }

  // Canvas内に置かれたCanvasItem内での座標。
  export class Pos {
    x :number;
    y :number;
    owner :CanvasItem;

    constructor(x :number, y :number, owner :CanvasItem) {
      this.x = x;
      this.y = y;
      this.owner = owner;
    }
    toString() :string {
      return '(' + this.x + ', ' + this.y + ')';
    }
  }
  // Canvas内での座標。
  export class Pointer {
    cx :number;
    cy :number;

    constructor(cx :number, cy :number) {
      this.cx = cx;
      this.cy = cy;
    }
    at(area :CanvasItem) :Pos {
      return new Pos(
        this.cx - area.pointer.cx,
        this.cy - area.pointer.cy,
        area);
    }
    atTop() :Pos {
      return new Pos(this.cx, this.cy, null);
    }
  }
  export function toPointer(e :MouseEvent, canvas :HTMLCanvasElement) :Pointer {
    var clientRect = canvas.getBoundingClientRect();
    var cx = (e.clientX - clientRect.left)
          * canvas.width / canvas.offsetWidth;
    var cy = (e.clientY - clientRect.top)
          * canvas.height / canvas.offsetHeight;
    return new Pointer(cx, cy);
  }
}
