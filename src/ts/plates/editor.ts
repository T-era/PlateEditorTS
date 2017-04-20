/// <reference path='../../lib/tools.d.ts'/>
/// <reference path='editor_model.ts'/>

module plates {
  export interface Editor extends tools.CanvasItem{
    model :EditorModel;
    tryAdd(item :PlateItem, pos :tools.Pos);
    tryRmv(pos :tools.Pos) :PlateItem;

    redraw();
  }
  export function newEditor(canvas :HTMLCanvasElement,
      context :CanvasRenderingContext2D,
      config :Config,
      getOnMouse :() => PlateItem) :Editor{
    return new _Editor(canvas, context, config, getOnMouse);
  }
  var SHADOW_ON_SUGGESTION :tools.Shadow = {
      blur: 20,
      offsetX: 20,
      offsetY: 30 };

  class _Editor implements Editor {
    pointer :tools.Pointer;
    size :tools.Size;
    model :EditorModel;

    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    config :Config;
    getOnMouse :() => PlateItem;

    constructor(canvas :HTMLCanvasElement,
        context :CanvasRenderingContext2D,
        config :Config,
        getOnMouse :() => PlateItem) {
      this.pointer = new tools.Pointer(0, 0);
      this.size = {
        width: canvas.width,
        height: canvas.height
      };
      this.canvas = canvas;
      this.context = context;
      this.config = config;
      this.getOnMouse = getOnMouse;
      this.model = newEditorModel(config);
      var that = this;

      canvas.onmousemove = tools.event_chain(canvas.onmousemove, function(e) {
        var pointer = tools.toPointer(e, canvas);
        that.onMouseMove(pointer);
      });
    }
    onMouseMove(pointer :tools.Pointer) {
      var pos = pointer.at(this);
      if (tools.isOn(pos, this)) {
        var cellX = Math.floor(pos.x / this.config.unitWidth);
        var cellY = Math.floor(pos.y / this.config.unitHeight);
        if (cellX >= 0 && cellY >= 0) {
          var om = this.getOnMouse();
          if (om) {
            var suggestionConfig = {
              strokeColor: this.config.themeCol.lighten(),
              fillColor: this.config.themeCol.lighten().lighten(),
              alpha: 0.5,
              shadow: SHADOW_ON_SUGGESTION };
            var duplicated = this.model.getDuplicated(om, { lx: cellX, ly: cellY });
            if (duplicated.length === 0) {
              om.draw(new tools.Pointer(cellX * this.config.unitWidth, cellY * this.config.unitHeight), suggestionConfig);
            } else if (duplicated.length === 1) {
              var replacementConfig = {
                strokeColor: this.config.themeCol.ish(tools.RED),
                fillColor: this.config.themeCol.ish(tools.RED),
                shadow: SHADOW_ON_SUGGESTION };
              om.draw(new tools.Pointer(cellX * this.config.unitWidth, cellY * this.config.unitHeight), suggestionConfig);
              var replacementAt = duplicated[0];
              var repItem = replacementAt.item;
              var repAt = replacementAt.at;
              repItem.draw(new tools.Pointer(repAt.lx * this.config.unitWidth, repAt.ly * this.config.unitHeight), replacementConfig);
            }
          }
        }
      }
    }

    redraw() {
      this.drawLadder();
    }
    drawLadder() {
      var context = this.context;
      var config = this.config;

      context.beginPath();
      var ladderHConfig = {
        strokeColor: config.themeCol.lighten(),
        lineDash: [3,3]
      };
      for (var x = config.unitWidth; x < config.editorWidth; x += config.unitWidth) {
        tools.line(context,
          new tools.Pointer(x, 0),
          new tools.Pointer(x, config.editorHeight),
          ladderHConfig);
      }
      for (var y = config.unitHeight; y < config.editorHeight;  y += config.unitHeight) {
        tools.line(context,
          new tools.Pointer(0, y),
          new tools.Pointer(config.editorWidth, y),
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
          var y = cellY * config.unitHeight;
          var x = cellX * config.unitWidth;
          var itemAt = items[cellY][cellX];
          if (itemAt && itemAt.at.lx == cellX && itemAt.at.ly == cellY) {
            var item = itemAt.item;
            item.drawPath(context, new tools.Pointer(x, y), item.drawConfig);
          }
        }
      }
    }

    tryAdd(item :PlateItem, pos :tools.Pos) {
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
        var left = cellX * this.config.unitWidth;
        var top = cellY * this.config.unitHeight;

        this.model.put(item, lPos);
        this.context.strokeStyle = this.config.themeCol.darken().toString();
        item.draw(new tools.Pointer(left, top));
        this.context.stroke();
      }
    }
    tryRmv(pos :tools.Pos) :PlateItem {
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
      this.context.clearRect(left, top, item.size.width, item.size.height);
      this.drawLadder();
    }
    clearAt2(itemAt :PlateItemAt) {
      this.clearAt(itemAt.at.lx, itemAt.at.ly, itemAt.item);
    }
  }
}
