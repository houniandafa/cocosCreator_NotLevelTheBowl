import { _decorator, Component, Node, Label } from 'cc';
import { UIManager } from '../framework/UIManager';
import { DataStorage } from '../utils/DataStorage';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('LevelSelect')
export class LevelSelect extends UIBase {

    @property(Node) backStartButton: Node = null;//返回游戏开始页面
    @property(Node) levelsRoot: Node = null;//关卡父级

    start() {

    }
     /** 列表显示时要根据已有数据显示解锁关卡 */
    show() {
        super.show();
        const unLockLevel = DataStorage.getUnLockLevel()
        this.levelsRoot.children.forEach((node, index) => {
            const labelNode = node.children[1]
            const labelComp = labelNode.getComponent(Label)
            const level = index + 1
            labelComp.string = level <= unLockLevel ? '已解锁' : '未解锁'
        })

    }
    /** 初始化按钮监听事件，注入管理实例 */
    init(uiManager: UIManager) {
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = Node.EventType
        // 返回开始菜单按钮
        Util.addEffectBtn(this.backStartButton, () => {
            uiManager.backToStartMenu();
        }, this);

        // 关卡列表
        this.levelsRoot.children.forEach((node, index) => {
            const button = node.children[0]

            // button.on(TOUCH_START, () => {
            //     MusicManager.getInstance().play(MusicType.Click)
            //     Util.clickDownTween(button)
            // }, this)

            // button.on(TOUCH_END, () => {
            //     Util.clickUpTween(button, () => {
            //         const level = index + 1
            //         if (level <= DataStorage.getUnLockLevel()) {
            //             uiManager.gameStart(level)
            //         }
            //     })
            // }, this)

            // button.on(TOUCH_CANCEL, () => Util.clickUpTween(button), this)

            Util.addEffectBtn(button, () => {
                const level = index + 1
                if (level <= DataStorage.getUnLockLevel()) {
                    uiManager.gameStart(level)
                }
            }, this);
        })
    }
}

