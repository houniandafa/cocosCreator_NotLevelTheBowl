import { _decorator, Component, Node } from 'cc';
import { UIManager } from '../framework/UIManager';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('winPanel')
export class winPanel extends UIBase {

    @property(Node) nextLevelButton: Node = undefined
    @property(Node) backToMenuButton: Node = undefined

    show() {
        super.show()
    }

    hideNextLevelButton() {
        this.nextLevelButton.active = false
    }

    /** 初始化按钮监听事件，注入管理实例 */
    init(uiManager: UIManager) {
        // 返回菜单按钮
        Util.addEffectBtn(this.backToMenuButton, () => {
            uiManager.backToStartMenu();
        }, this);
        // 下一关按钮
        Util.addEffectBtn(this.nextLevelButton, () => {
            uiManager.onClickNextLevel()
        }, this);
        
    }
}

