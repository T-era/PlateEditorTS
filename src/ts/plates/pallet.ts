module plates {
  export class Pallet implements canvas_tools.CanvasItem {
    pointer :canvas_tools.Pointer;
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    config :Config
    selections :PlateItem[];

    constructor(canvas :HTMLCanvasElement, context :CanvasRenderingContext2D, config :Config, pointer :canvas_tools.Pointer) {
      var that = this;
      this.canvas = canvas;
      this.context = context;
      this.config = config;
      this.selections = config.selections;
      this.pointer = pointer;
    }
    getSelection(pointer :canvas_tools.Pointer) :PlateItem {
      for (var i = 0, max = this.selections.length; i < max; i ++) {
        var selection = this.selections[i];
        var pos = pointer.at(selection);
        if (selection.isOn(pos)) {
          return selection;
        }
      }
      return null;
    }

    isOn(pos :canvas_tools.Pos) :boolean {
      return pos.x >= 0 && pos.x < this.canvas.width - this.pointer.cx
          && pos.y >= 0 && pos.y < this.canvas.height - this.pointer.cy;
    }

    drawItems() {
      var that = this;
      this.selections.forEach(function(item :PlateItem) {
        item.draw(that.context, item.pointer);
      });
    }
  }
}
