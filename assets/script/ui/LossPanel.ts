import { _decorator, Component, Node } from 'cc';
import { UIManager } from '../framework/UIManager';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('LossPanel')
export class LossPanel extends UIBase {

    @property(Node) playAgainButton: Node = null;
    @property(Node) backToMenuButton: Node = null;

    show(){
        super.show();
    }

    init(uiManager: UIManager){
        // 返回菜单按钮
        Util.addEffectBtn(this.backToMenuButton, () => {
            uiManager.backToStartMenu();
        }, this);
        // 再玩一次按钮
        Util.addEffectBtn(this.playAgainButton, () => {
            uiManager.onClickPlayAgain();
        }, this);
    }

    update(deltaTime: number) {
        
    }
}

