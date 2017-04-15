/// <reference path='../../lib/canvas_tools.d.ts'/>
/// <reference path='editor_model.ts'/>

module plates {
  export interface Editor extends canvas_tools.CanvasItem{
    model :EditorModel;
    tryAdd(item :PlateItem, pos :canvas_tools.Pos);
    tryRmv(pos :canvas_tools.Pos) :PlateItem;

    draw();
    isOn(pos :canvas_tools.Pos) :boolean;
  }
  export function newEditor(canvas :HTMLCanvasElement,
      context :CanvasRenderingContext2D,
      config :Config,
      index :number,
      editor :EditorConfig,
      getOnMouse :() => PlateItem) :Editor{
    return new _Editor(canvas, context, config, index, editor, getOnMouse);
  }
  var SHADOW_ON_SUGGESTION :canvas_tools.Shadow = {
      blur: 20,
      offsetX: 20,
      offsetY: 3 };

  class _Editor implements Editor {
    pointer :canvas_tools.Pointer;
    model :EditorModel;

    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    config :Config;
    index :number;
    editor :EditorConfig;
    getOnMouse :() => PlateItem;

    constructor(canvas :HTMLCanvasElement,
        context :CanvasRenderingContext2D,
        config :Config,
        index :number,
        editor :EditorConfig,
        getOnMouse :() => PlateItem) {
      this.pointer = new canvas_tools.Pointer(index * config.plateWidth, 0);
      this.canvas = canvas;
      this.context = context;
      this.config = config;
      this.index = index;
      this.editor = editor;
      this.getOnMouse = getOnMouse;
      var maxY = Math.floor((canvas.height - config.iconHeight) / config.unitHeight);
      this.model = newEditorModel(config, maxY);
      var that = this;

      canvas.onmousemove = canvas_tools.event_chain(canvas.onmousemove, function(e) {
        var pointer = canvas_tools.toPointer(e, canvas);
        that.onMouseMove(pointer);
      });
    }
    onMouseMove(pointer :canvas_tools.Pointer) {
      var pos = pointer.at(this);
      if (this.isOn(pos)) {
        var editorY = pos.y - this.config.iconHeight;
        var cellY = Math.floor(editorY / this.config.unitHeight);
        if (cellY >= 0) {   // アイコンの領域もあるでな。
          var om = this.getOnMouse();
          if (om) {
            var ovwStatus = this.model.canAdd(om, cellY);
            if (ovwStatus == OverwriteStatus.Empty) {
              var dc = {
                color: this.editor.themeCol.lighten(),
                shadow: SHADOW_ON_SUGGESTION };
              om.draw(this.context, new canvas_tools.Pointer(this.index * this.config.plateWidth, 1 + this.config.iconHeight + cellY * this.config.unitHeight), dc);
            } else if (ovwStatus == OverwriteStatus.Replace) {
              var dc = {
                color: this.editor.themeCol.ish(canvas_tools.RED),
                shadow: SHADOW_ON_SUGGESTION };
              om.draw(this.context, new canvas_tools.Pointer(this.index * this.config.plateWidth, 1 + this.config.iconHeight + cellY * this.config.unitHeight), dc);
            }
          }
        }
      }
    }

    draw() {
      var canvas = this.canvas;
      var context = this.context;
      var config = this.config;
      var index = this.index;
      var editor = this.editor;
      var x = index * (config.plateWidth + 2);

      context.beginPath();
      context.strokeStyle = editor.themeCol.toString();
      editor.drawIcon(this.context, new canvas_tools.Pointer(x + 1, 1));
      context.stroke();

      this.drawLadder();
    }
    drawLadder() {
      var canvas = this.canvas;
      var context = this.context;
      var config = this.config;
      var editor = this.editor;
      var index = this.index;
      var x = index * (config.plateWidth + 2);
      context.beginPath();
      context.strokeStyle = editor.themeCol.lighten().toString();
      context.moveTo(x, 1 + config.iconHeight);
      context.lineTo(x, canvas.height);
      context.moveTo(x + config.plateWidth + 1, 1 + this.config.iconHeight);
      context.lineTo(x + config.plateWidth + 1, canvas.height);
      context.stroke();

      context.beginPath();
      context.strokeStyle = editor.themeCol.lighten().toString();
      context.setLineDash([3, 3]);
      for (var y = config.iconHeight + config.unitHeight + 1; y < canvas.height;  y += config.unitHeight) {
        context.moveTo(x, y);
        context.lineTo(x + config.plateWidth, y);
      }
      context.stroke();
      context.setLineDash([]);
    }
    isOn(pos :canvas_tools.Pos) :boolean {
      return 0 <= pos.x
          && pos.x <= this.config.plateWidth - 1;
    }
    tryAdd(item :PlateItem, pos :canvas_tools.Pos) {
      var editorY = pos.y - this.config.iconHeight;
      var cellY = Math.floor(editorY / this.config.unitHeight);

      this.context.beginPath();
      var ovwStatus = this.model.canAdd(item, cellY);
      if (ovwStatus == OverwriteStatus.Replace) {
        this.clearAt(cellY, item);
      }
      if (ovwStatus != OverwriteStatus.Locked) {
        var left = 1 + this.pointer.cx;
        var top = 1 + this.config.iconHeight + cellY * this.config.unitHeight;

        this.model.put(item, cellY);
        this.context.strokeStyle = this.editor.themeCol.darken().toString();
        item.draw(this.context, new canvas_tools.Pointer(left, top));
        this.context.stroke();
      }
    }
    tryRmv(pos :canvas_tools.Pos) :PlateItem {
      var editorY = pos.y - this.config.iconHeight;
      var cellY = Math.floor(editorY / this.config.unitHeight);

      var itemAt = this.model.dropAt(cellY);
      if (itemAt) {
        this.clearAt(itemAt.at, itemAt.item);
      }
      return itemAt.item;
    }
    clearAt(cellY :number, item :PlateItem) {
      var left = 1 + this.pointer.cx;
      var top = 1 + this.config.iconHeight + cellY * this.config.unitHeight;
      var right = left + this.config.plateWidth - 2;
      var bottom = top + item.height - 2;
      this.context.clearRect(left, top, right - left, bottom - top);
      this.drawLadder();
    }
  }
}
