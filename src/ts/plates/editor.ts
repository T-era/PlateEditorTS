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
      getOnMouse :() => PlateItem) :Editor{
    return new _Editor(canvas, context, config, getOnMouse);
  }
  var SHADOW_ON_SUGGESTION :canvas_tools.Shadow = {
      blur: 20,
      offsetX: 20,
      offsetY: 30 };

  class _Editor implements Editor {
    pointer :canvas_tools.Pointer;
    model :EditorModel;

    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    config :Config;
    getOnMouse :() => PlateItem;

    constructor(canvas :HTMLCanvasElement,
        context :CanvasRenderingContext2D,
        config :Config,
        getOnMouse :() => PlateItem) {
      this.pointer = new canvas_tools.Pointer(0, 0);
      this.canvas = canvas;
      this.context = context;
      this.config = config;
      this.getOnMouse = getOnMouse;
      this.model = newEditorModel(config);
      var that = this;

      canvas.onmousemove = canvas_tools.event_chain(canvas.onmousemove, function(e) {
        var pointer = canvas_tools.toPointer(e, canvas);
        that.onMouseMove(pointer);
      });
    }
    onMouseMove(pointer :canvas_tools.Pointer) {
      var pos = pointer.at(this);
      if (this.isOn(pos)) {
        var cellX = Math.floor(pos.x / this.config.unitWidth);
        var cellY = Math.floor(pos.y / this.config.unitHeight);
        if (cellX >= 0 && cellY >= 0) {
          var om = this.getOnMouse();
          if (om) {
            var suggestionConfig = {
              color: this.config.themeCol.lighten(),
              shadow: SHADOW_ON_SUGGESTION };
            var duplicated = this.model.getDuplicated(om, { lx: cellX, ly: cellY });
            if (duplicated.length === 0) {
              om.draw(this.context, new canvas_tools.Pointer(1 + cellX * this.config.unitWidth, 1 + cellY * this.config.unitHeight), suggestionConfig);
            } else if (duplicated.length === 1) {
              var replacementConfig = {
                color: this.config.themeCol.ish(canvas_tools.RED),
                shadow: SHADOW_ON_SUGGESTION };
              om.draw(this.context, new canvas_tools.Pointer(1 + cellX * this.config.unitWidth, 1 + cellY * this.config.unitHeight), suggestionConfig);
              var replacementAt = duplicated[0];
              var repItem = replacementAt.item;
              var repAt = replacementAt.at;
              repItem.draw(this.context, new canvas_tools.Pointer(1 + repAt.lx * this.config.unitWidth, 1 + repAt.ly * this.config.unitHeight), replacementConfig);
            }
          }
        }
      }
    }

    draw() {
      this.drawLadder();
    }
    drawLadder() {
      var context = this.context;
      var config = this.config;

      context.beginPath();
      var ladderHConfig = {
        color: config.themeCol.lighten(),
        lineDash: [3,3]
      };
      for (var x = config.unitWidth + 1; x < config.editorWidth; x += config.unitWidth) {
        canvas_tools.line(context,
          new canvas_tools.Pointer(x, 0),
          new canvas_tools.Pointer(x, config.editorHeight),
          ladderHConfig);
      }
      for (var y = config.unitHeight + 1; y < config.editorHeight;  y += config.unitHeight) {
        canvas_tools.line(context,
          new canvas_tools.Pointer(0, y),
          new canvas_tools.Pointer(config.editorWidth, y),
          ladderHConfig);
      }
      context.stroke();
    }

    drawItems() {
      var context = this.context;
      var config = this.config;
      var model = this.model;
      var items = model.list();
      for (var cellY = 0, maxY = items.length; cellY < maxY; cellY ++) {
        for (var cellX = 0, maxX = items[cellY].length; cellX < maxX; cellX ++) {
          var y = 1 + cellY * config.unitHeight;
          var x = 1 + cellX * config.unitWidth;
          var itemAt = items[cellY][cellX];
          if (itemAt && itemAt.at.lx == cellX && itemAt.at.ly == cellY) {
            var item = itemAt.item;
            item.drawPath(context, new canvas_tools.Pointer(x, y), item.drawConfig);
          }
        }
      }
    }

    isOn(pos :canvas_tools.Pos) :boolean {
      return 0 <= pos.x && pos.x < this.config.editorWidth
          && 0 <= pos.y && pos.y < this.config.editorHeight;
    }
    tryAdd(item :PlateItem, pos :canvas_tools.Pos) {
      var cellX = Math.floor(pos.x / this.config.unitWidth);
      var cellY = Math.floor(pos.y / this.config.unitHeight);
      var lPos = {
        lx: cellX,
        ly: cellY
      };

      this.context.beginPath();
      var duplicated = this.model.getDuplicated(item, lPos);
      if (duplicated.length === 1) {
        var removed = this.model.dropAt(lPos, item);
        if (removed) {
          this.clearAt2(removed);
        }
      }
      if (duplicated.length <= 1) {
        var left = 1 + cellX * this.config.unitWidth;
        var top = 1 + cellY * this.config.unitHeight;

        this.model.put(item, lPos);
        this.context.strokeStyle = this.config.themeCol.darken().toString();
        item.draw(this.context, new canvas_tools.Pointer(left, top));
        this.context.stroke();
      }
    }
    tryRmv(pos :canvas_tools.Pos) :PlateItem {
      var cellX = Math.floor(pos.x / this.config.unitWidth);
      var cellY = Math.floor(pos.y / this.config.unitHeight);
      var lPos = {
        lx: cellX,
        ly: cellY
      }
      var itemAt = this.model.dropAt(lPos);
      if (itemAt) {
        this.clearAt2(itemAt);
        return itemAt.item;
      }
      return null;
    }
    clearAt(cellX :number, cellY :number, item :PlateItem) {
      var left = cellX * this.config.unitWidth;
      var top = cellY * this.config.unitHeight;
      this.context.clearRect(left, top, item.width, item.height);
      this.drawLadder();
    }
    clearAt2(itemAt :PlateItemAt) {
      this.clearAt(itemAt.at.lx, itemAt.at.ly, itemAt.item);
    }
  }
}
