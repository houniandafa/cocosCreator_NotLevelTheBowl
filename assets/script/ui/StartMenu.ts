import { _decorator, Component, Node, Tween, tween, utils, Button } from 'cc';
import { UIManager } from '../framework/UIManager';
import { DataStorage } from '../utils/DataStorage';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends UIBase {

    @property(Node) startButton: Node = null;
    @property(Node) levelSelectButton: Node = null;

    start() {

    }

    show() {
        super.show()
        // 摇摆动画
        const node = this.startButton.children[0]
        Tween.stopAllByTarget(node)
        node.angle = 0;
        tween(node).repeatForever(
            tween()
                .to(1, { angle: 10 })
                .to(1, { angle: 0 })
            ).start()
    }

    init(uiManager:UIManager){
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = Node.EventType
        // 开始游戏按钮
        // this.startButton.on(TOUCH_START, () => {
        //     // MusicManager.getInstance().play(MusicType.Click)
        //     console.log("开始游戏按钮")
        //     // Util.clickDownTween(this.startButton)
        // }, this)

        // this.startButton.on(TOUCH_END, () => {
        //     Util.clickUpTween(this.startButton, () => {
        //         // uiManager.gameStart(DataStorage.getUnLockLevel())
        //     })
        // }, this)
 
        // this.startButton.on(TOUCH_CANCEL, () => {
        //     Util.clickUpTween(this.startButton)
        // }, this)
        Util.addEffectBtn(this.startButton,() => {
            uiManager.gameStart(DataStorage.getUnLockLevel())
        },this)
        Util.addEffectBtn(this.levelSelectButton,() => {
            console.log("点击了levelSelectButton") 
            uiManager.toLevelSelect();
        },this)
        // this.node.on(Node.EventType.TOUCH_END, this.downTurtle, this);
        // 关卡选择按钮
        // this.levelSelectButton.on(TOUCH_START, () => {
        //     // MusicManager.getInstance().play(MusicType.Click)
        //     console.log("关卡选择按钮")
        //     Util.clickDownTween(this.levelSelectButton)
        // }, this)
 
        // this.levelSelectButton.on(TOUCH_END, () => {
        //     Util.clickUpTween(this.levelSelectButton, () => {
        //         // uiManager.toLevelSelect()
        //     })
        // }, this)
 
        // this.levelSelectButton.on(TOUCH_CANCEL, () => {
        //     Util.clickUpTween(this.levelSelectButton)
        // }, this)
 
    }
    onDisable(){

    }
    
}

