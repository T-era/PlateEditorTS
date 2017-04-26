/// <reference path='../../lib/tools.d.ts'/>
/// <reference path='editor_model.ts'/>

module plates {
  export interface Editor extends tools.CanvasItem{
    model :EditorModel;
    tryAdd(item :PlateItem, pos :tools.Pos) :boolean;
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

    drawSuggestion :() => void;

    constructor(canvas :HTMLCanvasElement,
        context :CanvasRenderingContext2D,
        config :Config,
        getOnMouse :() => PlateItem) {
      this.pointer = new tools.Pointer(0, 0);
      this.size = config.editorSize;
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
      this.drawSuggestion = null;
      if (! tools.isOn(pos, this)) {
        return;
      }
      var lPos = toLogicalPos(this.config, pos, Math.floor);
      var om = this.getOnMouse();
      if (lPos.lx >= 0 && lPos.ly >= 0 && om) {
        if (this.isInRange(om.size, lPos)) {
          var suggestionConfig = _getSuggestionConfig(this.config.themeCol);
          var duplicated = this.model.getDuplicated(om, lPos);
          if (duplicated.length === 0) {
            this.drawSuggestion = function() {
              om.draw(fromLogicalPos(this.config, lPos, this).pointer(), suggestionConfig);
            }.bind(this);
          } else if (duplicated.length === 1) {
            var replacementConfig = _getReplacementConfig(this.config.themeCol);
            var replacementAt = duplicated[0];
            var repItem = replacementAt.item;
            var repAt = replacementAt.at;
            this.drawSuggestion = function() {
              om.draw(fromLogicalPos(this.config, lPos, this).pointer(), suggestionConfig);
              repItem.draw(fromLogicalPos(this.config, repAt, this).pointer(), replacementConfig);
            }.bind(this);
          }
        }
      }
    }

    redraw(p ?:tools.Pointer, s ?:tools.Size) {
      //  TODO 矩形内だけ描画する？？
      this.drawLadder();
      this.drawItems();
      if (this.drawSuggestion) {
        this.drawSuggestion();
      }
    }

    drawLadder() {
      var context = this.context;
      var config = this.config;

      var ladderHConfig = {
        strokeColor: config.themeCol.lighten(),
        lineDash: [3,3]
      };
      for (var x = config.unitSize.width; x < config.editorSize.width; x += config.unitSize.width) {
        tools.line(context,
          new tools.Pointer(this.pointer.cx + x, this.pointer.cy),
          new tools.Pointer(this.pointer.cx + x, this.pointer.cy + config.editorSize.height),
          ladderHConfig);
      }
      for (var y = config.unitSize.height; y < config.editorSize.height;  y += config.unitSize.height) {
        tools.line(context,
          new tools.Pointer(this.pointer.cx, this.pointer.cy + y),
          new tools.Pointer(this.pointer.cx + config.editorSize.width, this.pointer.cy + y),
          ladderHConfig);
      }
    }

    drawItems() {
      var context = this.context;
      var config = this.config;
      var model = this.model;
      var items = model.list();
      for (var cellY = 0, maxY = items.length; cellY < maxY; cellY ++) {
        if (! items[cellY]) { continue; }
        for (var cellX = 0, maxX = items[cellY].length; cellX < maxX; cellX ++) {
          var itemAt = items[cellY][cellX];
          if (itemAt && itemAt.at.lx == cellX && itemAt.at.ly == cellY) {
            var item = itemAt.item;
            var pointer = fromLogicalPos(this.config, { lx: cellX, ly: cellY }, this).pointer();
            item.drawPath(context, pointer, item.drawConfig);
          }
        }
      }
    }

    tryAdd(item :PlateItem, pos :tools.Pos) :boolean {
      var lPos = toLogicalPos(this.config, pos, Math.floor);

      if (this.isInRange(item.size, lPos)) {
        var duplicated = this.model.getDuplicated(item, lPos);
        if (duplicated.length === 1) {
          var removed = this.model.dropAt(lPos, item);
        }
        if (duplicated.length <= 1) {
          this.model.put(item, lPos);
          return true;
        }
      }
      return false;
    }
    isInRange(size :tools.Size, lPos :LogicalPos) {
      var lSize = toLogicalSize(this.config, size, Math.ceil);
      return 0 <= lPos.lx && lPos.lx < this.model.maxX - lSize.lWidth + 1
          && 0 <= lPos.ly && lPos.ly < this.model.maxY - lSize.lHeight + 1;
    }
    tryRmv(pos :tools.Pos) :PlateItem {
      var lPos = toLogicalPos(this.config, pos, Math.floor);

      var itemAt = this.model.dropAt(lPos);
      if (itemAt) {
        return itemAt.item;
      }
      return null;
    }
  }
  function _getSuggestionConfig(themeCol :tools.Color) {
    return {
      strokeColor: themeCol.lighten(),
      fillColor: themeCol.lighten().lighten(),
      alpha: 0.5,
      shadow: SHADOW_ON_SUGGESTION };
  }
  function _getReplacementConfig(themeCol :tools.Color) {
    return {
      alpha: 0.7,
      strokeColor: themeCol.ish(tools.RED),
      fillColor: themeCol.ish(tools.RED),
      shadow: SHADOW_ON_SUGGESTION };
  }
}
