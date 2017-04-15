/// <reference path='../../lib/canvas_tools.d.ts'/>

module plates {
  export interface PlateItemAt {
    item :PlateItem;
    at :number;
  }
  export interface EditorModel {
    canAdd(item :PlateItem, y :number) :OverwriteStatus;

    put(item :PlateItem, y :number);
    list() :PlateItem[];
    dropAt(y :number) :PlateItemAt;
  }
  export function newEditorModel(config :Config, maxY :number) :EditorModel {
    return new _EditorModel(config, maxY);
  }
  export enum OverwriteStatus { Empty, Locked, Replace }

  class _EditorModel implements EditorModel {
    listContents :PlateItem[] = [];  // TODO 配列でいいのか...？
    maxY;
    config :Config;

    constructor(config :Config, maxY :number) {
      this.config = config;
      this.maxY = maxY;
    }

    canAdd(item :PlateItem, y :number) :OverwriteStatus {
      var unitY = item.height / this.config.unitHeight;
      for (var i = 1; i < unitY; i ++) {
        if (y + i > this.maxY || this.listContents[y + i]) {
          return OverwriteStatus.Locked;
        }
      }
      for (var m = y - 1; m >= 0; m --) {
        if (this.listContents[m]) {
          // 最初に見つかったものだけチェックすれば十分。
          var upperCells = this.listContents[m].height / this.config.unitHeight;
          if (y - m < upperCells) {
            return OverwriteStatus.Locked;
          }
        }
      }
      return (this.listContents[y] == null
          ? OverwriteStatus.Empty
          : OverwriteStatus.Replace);
    }

    put(item :PlateItem, y :number) {
      this.listContents[y] = item;
    }
    list() :PlateItem[] {
      return this.listContents;
    }
    dropAt(y :number) :PlateItemAt {
      for (var temp = y; temp >= 0; temp --) {
        var item = this.listContents[temp];
        if (item && item.height / this.config.unitHeight > y - temp) {
          this.listContents[temp] = null;
          return { item: item, at : temp };
        }
      }
      return null;
    }
  }
}
