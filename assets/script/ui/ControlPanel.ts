import { _decorator, Component, Node, EventTouch, UITransform, v3, misc, Vec3, markAsWarning } from 'cc';
import { AudioManager } from '../framework/AudioManager';
import { MuiscResUrl } from '../framework/Constant';
import { UIManager } from '../framework/UIManager';
import { Util } from '../utils/Util';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('ControlPanel')
export class ControlPanel extends UIBase {

    @property(Node) panelBkNode: Node = null;
    @property(Node) panelMidNode: Node = null;
    @property(Node) clickDownButton: Node = null;
    @property(Node) clickLeftButton: Node = null;
    @property(Node) clickRightButton: Node = null;

    // 左移与右移
    leftOpen: boolean = false
    rightOpen: boolean = false

    // 记录管理实例
    uiManager: UIManager = null;

    start() {

    }

    show(){
        super.show()
    }

    init(uiManager:UIManager){
        const { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL } = Node.EventType
        this.uiManager = uiManager
 
        // 轮盘事件
        this.panelBkNode.on(TOUCH_START, (event: EventTouch) => {
            // MusicManager.getInstance().play(MusicType.Click)
            AudioManager.instance.playSound(MuiscResUrl.Click)
            const locat = event.getUILocation()//
            const pos = this.panelBkNode.getComponent(UITransform).convertToNodeSpaceAR(v3(locat.x,locat.y))
            this.panelMidNode.setPosition(this.limitMidNodePos(pos))
            const angle = misc.radiansToDegrees(Math.atan2(pos.y, pos.x)) - 90
            uiManager.onRotateFood(angle)
        }, this)
 
        this.panelBkNode.on(TOUCH_MOVE, (event: EventTouch) => {
            const locat = event.getUILocation()
            const pos = this.panelBkNode.getComponent(UITransform).convertToNodeSpaceAR(v3(locat.x,locat.y))
            this.panelMidNode.setPosition(this.limitMidNodePos(pos))
            const angle = misc.radiansToDegrees(Math.atan2(pos.y, pos.x)) - 90
            uiManager.onRotateFood(angle)
        }, this)
 
        this.panelBkNode.on(TOUCH_END, () => this.panelMidNode.setPosition(0, 0), this)
        this.panelBkNode.on(TOUCH_CANCEL, () => this.panelMidNode.setPosition(0, 0), this)
        // 左向按钮
        Util.addEffectBtn(this.clickLeftButton,() => {
            this.leftOpen = false;
        },this,null,() => {
            this.leftOpen = true;
        },() => {
            this.leftOpen = false;
        })
        // 右向按钮
        Util.addEffectBtn(this.clickRightButton,() => {
            this.rightOpen = false;
        },this,null,() => {
            this.rightOpen = true;
        },() => {
            this.rightOpen = false;
        })

        // 右向按钮
        Util.addEffectBtn(this.clickDownButton,() => {
            uiManager.onClickDownFood()
        },this)
        
    }

    limitMidNodePos(pos: Vec3): Vec3 {
        const R = 130
        
        const len = Vec3.len(pos)  
        const ratio = len > R ? R / len : 1
        return v3(pos.x * ratio, pos.y * ratio)
    }

    update(dt:number){
        this.leftOpen && this.uiManager.onClickLeftFood(dt)
        this.rightOpen && this.uiManager.onClickRightFood(dt)
    }
}

