/// <reference path='../../lib/canvas_tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='config.ts' />
/// <reference path='editor.ts' />
/// <reference path='pallet.ts' />

module plates {
  export class PlateEditor {
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    hover :hover.Hover;
    editor :Editor;
    config :Config;
    onMouse :PlateItem;
    pallet :Pallet;

    constructor(canvas :HTMLCanvasElement, config :Config) {
      var that = this;
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.hover = hover.newHover(canvas);
      this.config = config;

      var palletAt = new canvas_tools.Pointer(config.editorWidth + 2,0);
      this.pallet = new Pallet(canvas, this.context, config, palletAt);
      this.pallet.drawItems();

      this.editor = newEditor(canvas, that.context, config, function() { return that.onMouse; });
      this.editor.draw();

      this.hover.save();
      this.canvas.onclick = function(e :MouseEvent) {
        var pointer = canvas_tools.toPointer(e, that.canvas);
        if (that.onMouse) {
          that.put(pointer, that.onMouse);
          that.onMouse = null;
          that.hover.setHoverImage(null);
        } else {
          that.onMouse = that.holdOnMouse(pointer);
          if (that.onMouse) {
            that.hover.setHoverImage(function(context :CanvasRenderingContext2D, pointer :canvas_tools.Pointer, drawConfig? :canvas_tools.DrawConfig) {
              context.beginPath();
              var toCenter = new canvas_tools.Pointer(
                pointer.cx - Math.ceil(that.config.unitWidth / 2),
                pointer.cy - Math.ceil(that.config.unitHeight / 2));
              that.onMouse.draw(context, toCenter, drawConfig);
              context.stroke();
            });
          }
        }
      };
    }
    holdOnMouse(pointer :canvas_tools.Pointer) :PlateItem {
      var editor = this.editor;
      var pos = pointer.at(editor);
      if (editor.isOn(pos)) {
        return this.hover.update(function() {
          return editor.tryRmv(pos);
        });
      }
      return this.pallet.getSelection(pointer);
    }
    put(pointer :canvas_tools.Pointer, item :PlateItem) {
      var editor = this.editor;

      var pos = pointer.at(editor);
      if (editor.isOn(pos)) {
        this.hover.update(function() {
          editor.tryAdd(item, pos);
        });
      }
    }
  }
}
