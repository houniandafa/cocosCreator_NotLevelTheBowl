import { _decorator, Component, Node, tween, v3, Tween, Vec3, math, AudioClip, loader, resources } from 'cc';
import { AudioManager } from '../framework/AudioManager';
import { MuiscResUrl } from '../framework/Constant';
const { ccclass, property } = _decorator;

/** 工具类 */
export class Util {
    static clickDownTween(node: Node | undefined, callback?: () => void) {
        if (!node) {
            console.error('[Util] clickDownTween node is undefined')
            return
        }
        tween(node).to(0.1, { scale: v3(0.9, 0.9) }).call(() => {
            callback && callback()
        }).start()
    }

    static clickUpTween(node: Node | undefined, callback?: () => void) {
        if (!node) {
            console.error('[Util] clickDownTween node is undefined')
            return
        }
        tween(node).to(0.1, { scale: v3(1, 1) }).call(() => {
            callback && callback()
        }).start()
    }

    static addEffectBtn(node: Node | undefined, callBack: Function, thisObj: any, data?: any,
        startCallBack?: Function, outCallBack?: Function,
        isSound: boolean = true, $sx: number = 0.9, $sy: number = 0.9) {
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = Node.EventType;
        if (!node) {
            console.error('[Util] clickDownTween node is undefined')
            return
        }
        // AudioManager.instance().play("musicClick")
        function start(e: TouchEvent) {
            //注意v3里面的3个值都必须传，不然绑定事件会失效
            AudioManager.instance.playSound(MuiscResUrl.Click)
            startCallBack && startCallBack.call(thisObj, data);
            tween(node).to(0.1, { scale: v3(0.9, 0.9, 0.9) }).start()
        }
        function end(e: TouchEvent) {
            //注意v3里面的3个值都必须传，不然绑定事件会失效
            tween(node).to(0.1, { scale: v3(1, 1, 1) }).call(() => {
                callBack && callBack.call(thisObj, data);
            }).start()
        }
        function out(e: TouchEvent) {
            //注意v3里面的3个值都必须传，不然绑定事件会失效
            outCallBack && outCallBack.call(thisObj, data);
            tween(node).to(0.1, { scale: v3(1, 1, 1) }).start()
        }
        node.on(TOUCH_START, start, this)

        node.on(TOUCH_END, end, this)

        node.on(TOUCH_CANCEL, out, this)
    }

    /**
     * 移除指定缩放按钮事件
     * @param obj
     * @param callBack
     * @param thisObj
     */
    public removeEffectBtn(node: Node | undefined, callBack?: Function, thisObj?: any) {
        Tween.stopAll()
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = Node.EventType;
        // node.off(TOUCH_START, start, this)

        // node.off(TOUCH_END, end, this)

        // node.off(TOUCH_CANCEL, out, this)
    }

    /**
     *
     * @param obj 缩放对象
     * @param time
     * @param bScaleX 开始缩放的X
     * @param bScaleY
     * @param eScaleX 结束缩放的X
     * @param eScaleY
     * @param callBack 缩放完成的回调
     * @param thisObj
     */
    public showView(obj: Node, time: number = 300,
        bScaleX: number = 0, bScaleY: number = 0,
        eScaleX: number = 1, eScaleY: number = 1, callBack?: Function, thisObj?: any) {

        obj.active = true;
        // obj.scale = bScaleX;
        // obj.scaleY = bScaleY;
        obj.scale = v3(bScaleX, bScaleY)
        // egret.Tween.get(obj).to({ "scaleX": eScaleX, "scaleY": eScaleY }, time, egret.Ease.backOut).call(function N() {
        //     if (callBack)
        //         callBack.call(thisObj);
        // });
        Tween.stopAllByTarget(obj)
        tween(obj)
            .to(time, { scale: v3(eScaleX, eScaleY, eScaleY) }, {  // 这里以node的位置信息坐标缓动的目标 
                easing: "backIn",                                   // 缓动函数，可以使用已有的，也可以传入自定义的函数。      
            })
            .call(() => {
                if (callBack)
                    callBack.call(thisObj);
            })
            .start()
    }

    static loadMusic(url: MuiscResUrl): Promise<AudioClip | undefined> {
        return new Promise((resolve, reject) => {
            // loader.loadRes(url, AudioClip, (error, audioClip) => {
            //     if (error) {
            //         console.error('[Util] loadMusic error')
            //         resolve(undefined)
            //     }
            //     resolve(audioClip)
            // })
            // wait for while 
            const res = "music/" + url;
            resources.load(res, AudioClip, function (err, audioClip) {
                // audioClip.addRef();
                if (err) {
                    console.error('[Util] loadMusic error')
                    resolve(undefined)
                }
                console.log("audioClip",audioClip)
                resolve(audioClip)
            });
        })
    }
}

