/// <reference path='../../lib/tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='../../lib/scroll.d.ts' />
/// <reference path='config.ts' />
/// <reference path='editor.ts' />
/// <reference path='pallet.ts' />

module plates {
  export class PlateEditor implements tools.CanvasItem {
    pointer :tools.Pointer = new tools.Pointer(0, 0);
    size :tools.Size;
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    hover :hover.Hover;
    editor :Editor;
    config :Config;
    onMouse :PlateItem;
    pallet :Pallet;
    scroll :scroll.Scroll;

    constructor(canvas :HTMLCanvasElement, config :Config) {
      var that = this;
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.hover = hover.newHover(canvas, function() { that.redraw(); });
      this.config = config;
      this.size = canvas;

      var palletAt = new tools.Pointer(config.editorSize.width + 2,0);
      this.pallet = new Pallet(canvas, this.context, config, palletAt);

      this.editor = newEditor(canvas, that.context, config, function() { return that.onMouse; });
      this.scroll = new scroll.Scroll(canvas, this.context, {
        scroll: {
          pointer: this.pointer,
          size: config.editorShowSize,
          redraw: function() {
            tools.rect(that.context, that.pointer, config.editorShowSize.width, config.editorShowSize.height, null);
          } },
        scrollIn: this.editor,
        viscosity: 0.95 });

      this.canvas.onclick = function(e :MouseEvent) {
        var pointer = tools.toPointer(e, that.canvas);
        if (that.onMouse) {
          that.put(pointer, that.onMouse);
          that.onMouse = null;
          that.hover.setHoverImage(null);
        } else {
          that.onMouse = that.holdOnMouse(pointer);
          if (that.onMouse) {
            that.hover.setHoverImage(function(context :CanvasRenderingContext2D, pointer :tools.Pointer, drawConfig? :tools.DrawConfig) {
              context.beginPath();
              var toCenter = new tools.Pointer(
                pointer.cx - Math.ceil(that.config.unitSize.width / 2),
                pointer.cy - Math.ceil(that.config.unitSize.height / 2));
              that.onMouse.draw(toCenter, drawConfig);
              context.stroke();
            }, e);
          }
        }
      };
    }
    holdOnMouse(pointer :tools.Pointer) :PlateItem {
      var editor = this.editor;
      var pos = pointer.at(editor);
      if (this.isOnEditor(pos)) {
        return this.hover.update(function() {
          return editor.tryRmv(pos);
        });
      }
      return this.pallet.getSelection(pointer);
    }
    put(pointer :tools.Pointer, item :PlateItem) {
      var editor = this.editor;

      var pos = pointer.at(editor);
      if (this.isOnEditor(pos)) {
        this.hover.update(function() {
          editor.tryAdd(item, pos);
        });
      }
    }
    isOnEditor(pos :tools.Pos) :boolean {
      return 0 <= pos.x && pos.x < this.config.editorSize.width
          && 0 <= pos.y && pos.y < this.config.editorSize.height;
    }

    redraw() {
      this.scroll.redraw();
      this.pallet.redraw();
    }
  }
}
