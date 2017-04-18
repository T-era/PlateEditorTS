/// <reference path='../../lib/canvas_tools.d.ts'/>

module plates {
  export interface LogicalPos {
    lx: number,
    ly: number
  }
  export interface PlateItemAt {
    item :PlateItem;
    at :LogicalPos;
  }
  export interface EditorModel {
    canAdd(item :PlateItem, lPos :LogicalPos) :OverwriteStatus;

    put(item :PlateItem, lPos :LogicalPos);
    list() :PlateItemAt[][];
    dropAt(lPos :LogicalPos, replace ?:PlateItem) :PlateItemAt;
  }
  export function newEditorModel(config :Config) :EditorModel {
    return new _EditorModel(config);
  }
  export enum OverwriteStatus { Empty, Locked, Replace }

  class _EditorModel implements EditorModel {
    listContents :PlateItemAt[][] = [];
    maxX :number;
    maxY :number;
    config :Config;

    constructor(config :Config) {
      this.config = config;
      this.maxX = Math.floor(config.editorWidth / config.unitWidth);
      this.maxY = Math.floor(config.editorHeight / config.unitHeight);
    }

    canAdd(item :PlateItem, lPos :LogicalPos) :OverwriteStatus {
      var dup = this._getAround(lPos, item);

      if (dup.length === 0) {
        return OverwriteStatus.Empty;
      } else if (dup.length === 1){
        return OverwriteStatus.Replace;
      } else {
        return OverwriteStatus.Locked;
      }
    }

    put(item :PlateItem, lPos :LogicalPos) {
      var itemAt = {
        item: item,
        at: lPos
      };
      var unitWidht = Math.ceil(item.width / this.config.unitWidth);
      var unitHeight = Math.ceil(item.height / this.config.unitHeight);
      for (var i = 0; i < unitHeight; i ++) {
        for (var j = 0; j < unitWidht; j ++) {
          this._put({ lx: j + lPos.lx, ly: i + lPos.ly }, itemAt);
        }
      }
    }
    _put(lPos :LogicalPos, itemAt :PlateItemAt) {
      if (! this.listContents[lPos.ly]) {
        this.listContents[lPos.ly] = [];
      }
      this.listContents[lPos.ly][lPos.lx] = itemAt;
    }
    _get(lPos :LogicalPos) :PlateItemAt {
      if (0 <= lPos.ly && lPos.ly < this.listContents.length) {
        var list = this.listContents[lPos.ly];
        if (list && 0 <= lPos.lx && lPos.lx < list.length) {
          return list[lPos.lx];
        }
      }
      return null;
    }
    _getAround(lPos :LogicalPos, item :PlateItem) :PlateItemAt[] {
      var unitW = item.width / this.config.unitWidth;
      var unitH = item.height / this.config.unitHeight;
      var dup :PlateItemAt[] = [];
      for (var iiY = 0; iiY < unitH; iiY ++) {
        for (var iiX = 0; iiX < unitW; iiX ++) {
          var itemAt = this._get({ lx: lPos.lx + iiX, ly: lPos.ly + iiY });
          if (itemAt != null && dup.indexOf(itemAt) < 0) {
            dup.push(itemAt);
          }
        }
      }
      console.log(dup);
      return dup;
    }
    list() :PlateItemAt[][] {
      return this.listContents;
    }
    dropAt(lPos :LogicalPos, replace? :PlateItem) :PlateItemAt {
      var target :PlateItemAt;
      if (replace != null) {
        var dup = this._getAround(lPos, replace);
        if (dup.length === 1) {
          target = dup[0];
        } else {
          return null;
        }
      } else {
        target = this.listContents[lPos.ly][lPos.lx]
      }
      if (target != null) {
        var item = target.item;
        var at = target.at;
        var itemW = Math.ceil(item.width / this.config.unitWidth);
        var itemH = Math.ceil(item.height / this.config.unitHeight);
        for (var cellY = at.ly; cellY < at.ly + itemH; cellY ++) {
          for (var cellX = at.lx; cellX < at.lx + itemW; cellX ++) {
            this._put({ lx: cellX, ly: cellY }, null);
          }
        }
        return target;
      }
    }
  }
}
