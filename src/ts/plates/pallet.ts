module plates {
  export class Pallet implements tools.CanvasItem {
    pointer :tools.Pointer;
    size :tools.Size;
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    config :Config
    selections :PlateItem[];

    constructor(canvas :HTMLCanvasElement, context :CanvasRenderingContext2D, config :Config, pointer :tools.Pointer) {
      var that = this;
      this.canvas = canvas;
      this.context = context;
      this.config = config;
      this.selections = config.selections;
      this.pointer = pointer;
      this.size = {
        width: canvas.width - pointer.cx,
       height: canvas.height - pointer.cy
     };
    }
    getSelection(pointer :tools.Pointer) :PlateItem {
      for (var i = 0, max = this.selections.length; i < max; i ++) {
        var selection = this.selections[i];
        var pos = pointer.at(selection);
        if (tools.isOn(pos, selection)) {
          return selection;
        }
      }
      return null;
    }

    drawItems() {
      var that = this;
      this.selections.forEach(function(item :PlateItem) {
        item.draw(item.pointer);
      });
    }
    redraw() {
      this.drawItems();
    }
  }
}
