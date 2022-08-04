import { _decorator, Component, Node, Label } from 'cc';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('LevelInfo')
export class LevelInfo extends UIBase {

    @property(Label) nowLevelLabel: Label = null;
    @property(Label) nowItemsLabel: Label = null;

    show(){
        super.show();
    }

    setLevelLabel(level: number) {
        this.nowLevelLabel.string = `第${level}关`
    }
 
    setItemsLabel(nowNum: number, allNum: number) {
        this.nowItemsLabel.string = `${nowNum}/${allNum}`
    }
}

