/// <reference path='../../lib/tools.d.ts' />
/// <reference path='../../lib/hover.d.ts' />
/// <reference path='../../lib/scroll.d.ts' />
/// <reference path='config.ts' />
/// <reference path='plate_item.ts' />
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
      this.hover = hover.newHover(canvas);
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
            tools.rect(that.context, that.pointer, config.editorShowSize, config.scrollFrameStyle);
          }},
        scrollIn: this.editor,
        viscosity: config.scrollViscosity });

      this.canvas.onclick = function(e :MouseEvent) {
        var pointer = tools.toPointer(e, that.canvas);
        if (that.onMouse) {
          var ok = that.put(pointer, that.onMouse);
          if (ok) {
            that.onMouse = null;
            that.hover.setHoverImage(null);
          }
        } else {
          that.onMouse = that.holdOnMouse(pointer);
          if (that.onMouse) {
            that.hover.setHoverImage({
                hover: function(context :CanvasRenderingContext2D, pointer :tools.Pointer, drawConfig? :tools.DrawConfig) {
                  var center = new tools.Pointer(
                    pointer.cx - Math.ceil(that.config.unitSize.width / 2),
                    pointer.cy - Math.ceil(that.config.unitSize.height / 2));
                  that.onMouse.draw(center, drawConfig);
                },
                width: that.config.unitSize.width * 4,
                height: that.config.unitSize.height * 4
              }, e);
          }
        }
        that.redraw();
        that.hover.drawAt(e);
      };
    }
    holdOnMouse(pointer :tools.Pointer) :PlateItem {
      var editor = this.editor;
      var pos = pointer.at(editor);
      if (tools.isOn(pos, this.editor)) {
        return editor.tryRmv(pos);
      }
      return this.pallet.getSelection(pointer);
    }
    put(pointer :tools.Pointer, item :PlateItem) {
      var editor = this.editor;

      var pos = pointer.at(editor);
      if (tools.isOn(pos, this.editor)) {
        return editor.tryAdd(item, pos);
      } else {
        // Drop
        return true;
      }
    }

    redraw() {
      this.scroll.redraw();
      this.pallet.redraw();
    }
  }
}
