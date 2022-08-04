import { _decorator, Component, Node, v3, Prefab, SpriteFrame, tween, TweenAction, Tween, Sprite, v2, RigidBody, RigidBody2D, ERigidBody2DType, resources, AudioSource, assert, game, AudioClip } from 'cc';
import { GameConfig } from '../config/GameConfig';
import { DataStorage } from '../utils/DataStorage';
import { AudioManager } from './AudioManager';
import { MuiscResUrl } from './Constant';
import { FoodPoolManager } from './FoodPoolManager';
import { PhysicsManager } from './PhysicsManager';
import { StaticInstance } from './StaticInstance';
const { ccclass, property } = _decorator;

interface IMidConfig {
    level: number,
    count: number,
    node: Node | undefined
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({
        type: [Prefab],
        displayName: '食物预制体'
    })
    foodPrefabs: Prefab[] = [];

    @property(Node) foods: Node = null;//食物的父节点

    @property({
        type: SpriteFrame,
        displayName: '闭眼的碗'
    })
    closeEyeBowl: SpriteFrame = null;

    @property({
        type: SpriteFrame,
        displayName: '挣眼的碗'
    })
    openEyeBowl: SpriteFrame = null;

    @property(Node) bowl: Node = null;//碗

    midConfig: IMidConfig = {
        level: 0,//设置玩家关卡等级
        count: 0,//生成的食物数量
        node: undefined
    }

    // 时间累积与检测频率
    time: number = 0
    checkCD: number = 0.2

    // 进入游戏关卡
    isPlaying: boolean = false

    @property(AudioSource)
    public audioSource:AudioSource = null;

    onLoad(){
        resources.preload('music', AudioClip);
        const audioSource = this.node.getComponent(AudioSource)!;
        assert(audioSource);
        this.audioSource = audioSource;
        // 声明常驻根节点，该节点不会在场景切换中被销毁。目标节点必须是根节点，否则无效。
        game.addPersistRootNode(this.node);
        // 将节点封装到管理器中
        AudioManager.instance.init(this.audioSource);
    }

    start() {
        // this.showBowl();//眨眼动画
        StaticInstance.setGameManager(this)
        PhysicsManager.openPhysicsSystem()//开启物理系统
    }

    /*****************眨眼——start**********************/
    showBowl() {
        this.bowl.active = true
        // 眨眼动作
        Tween.stopAllByTarget(this.bowl)
        tween(this.bowl).repeatForever(
            tween()
                .delay(2)
                .call(() => {
                    this.bowl.getComponent(Sprite).spriteFrame = this.closeEyeBowl;
                })
                .delay(0.3)
                .call(() => this.bowl.getComponent(Sprite).spriteFrame = this.openEyeBowl)
        ).start();
    }
    hideBowl() {
        this.bowl.active = false
    }
    /*******************眨眼——end*********************/


    gameStart(level: number) {
        this.showBowl()
        this.midConfig.level = level//设置玩家关卡等级
        this.midConfig.count = 0
        this.midConfig.node = this.addFood(this.nowFoodType)//生成一个食物
        this.isPlaying = true
    }

    get nowFoodType(): number {
        return GameConfig[this.midConfig.level][this.midConfig.count]
    }
    //食物向左移动
    onClickLeftFood(dt: number) {
        if (!this.midConfig.node) { return }
        const speed = 100
        const pos = this.midConfig.node.position;
        // this.midConfig.node.x -= speed * dt
        this.midConfig.node.setPosition(pos.x - speed * dt, 450)
    }
    //食物向右移动
    onClickRightFood(dt: number) {
        if (!this.midConfig.node) { return }
        const speed = 100
        // this.midConfig.node.x += speed * dt
        const pos = this.midConfig.node.position;
        this.midConfig.node.setPosition(pos.x + speed * dt, 450)
    }
    //食物下落
    onClickDownFood() {
        if (!this.midConfig.node) { return }
        PhysicsManager.setRigidBoyDynamic(this.midConfig.node)
        PhysicsManager.setRigidBoyLinearVelocity(this.midConfig.node, v2(0, -5))
        // FoodPoolManager.instance().putNode(this.midConfig.node);
        this.midConfig.node = undefined
    }

    //在页面顶部随机生成食物
    addFood(type: number): Node {
        const pos = v3(0, 450)
        // const food = cc.instantiate(this.foodPrefabs[type])
        // this.foods.addChild(food)
        const food = FoodPoolManager.instance().getNode(this.foodPrefabs[type], this.foods)
        food.setPosition(pos)
        PhysicsManager.setRigidBoyStatic(food)
        this.midConfig.count++
        this.updateFoodCountUi()
        return food;
    }

    updateFoodCountUi() {
        StaticInstance.uiManager.setLevelInfo(this.midConfig.level, this.midConfig.count)
    }

    onRotateFood(angle: number) {
        if (!this.midConfig.node) { return }
        this.midConfig.node.angle = angle
    }
    //所有食物中是否都停止运动
    get allBodyStop(): boolean {
        for (let i = 0; i < this.foods.children.length; i++) {
            const node = this.foods.children[i]
            const body = node.getComponent(RigidBody2D)
            //刚体线性速度是否接近0
            if (!body.linearVelocity.equals(v2(0, 0), 0.1)) {
                return false
            }
        }
        return true
    }

    get someBodyStatic(): boolean {
        for (let i = 0; i < this.foods.children.length; i++) {
            const node = this.foods.children[i]
            const body = node.getComponent(RigidBody2D)
            //如果有食物刚体是处于静态的 说明是刚生成的食物还没有下落 就返回true
            if (body.type === ERigidBody2DType.Static) {
                return true
            }
        }
        return false
    }
    //是否可以继续添加食物
    get canAddFood(): boolean {
        const max = GameConfig[this.midConfig.level].length//当前关卡需要的最大食物数
        //如果生成的食物大于等于 当前关卡需要的最大食物数 就返回false 不能再生成食物
        if (this.midConfig.count >= max) {
            return false
        }
        return true
    }

    //检查是否通关 如果没有通过，并且能够生成食物，就继续生成食物
    checkAllBody() {
        //如果没有进入关卡 或者 有生成动物食物还没有下落  或者 有食物刚体还在运动，没有停止 就return
        if (!this.isPlaying || this.someBodyStatic || !this.allBodyStop) { return }
        //如果不能继续添加食物
        if (!this.canAddFood) {
            this.isPlaying = false
            this.gameWin()
            return
        }
        this.midConfig.node = this.addFood(this.nowFoodType)
    }

    checkFall() {
        let hasFall: boolean = false
        for (let i = 0; i < this.foods.children.length; i++) {
            const node = this.foods.children[i]
            const pos = node.position;
            //如果有食物刚体 下落到-800以下，说明没有被碗接住 失败
            if (pos.y < -800) {
                // node.destroy()
                FoodPoolManager.instance().putNode(node);
                hasFall = true
                break
            }
        }
        if (hasFall) {
            this.isPlaying = false
            this.gameLoss()
        }
    }

    gameWin() {
        // MusicManager.getInstance().play(MusicType.Win)
        AudioManager.instance.playSound(MuiscResUrl.Win)
        StaticInstance.uiManager.showGameWinUI()
        // 最后一关不显示“下一关”
        if (this.midConfig.level >= DataStorage.getMaxLevel()) {
            StaticInstance.uiManager.hideNextLevelButton()
            return
        }
        // 玩之前关不存
        if (this.midConfig.level < DataStorage.getUnLockLevel()) {
            return
        }
    }

    gameLoss() {
        // MusicManager.getInstance().play(MusicType.Loss)
        AudioManager.instance.playSound(MuiscResUrl.Loss)
        StaticInstance.uiManager.showGameLossUI()
    }
    //在玩一次
    onClickPlayAgain() {
        this.clearAllFood()//清除所有食物
        StaticInstance.uiManager.gameStart(this.midConfig.level)
    }

    onClickNextLevel() {
        this.midConfig.level += 1
        this.clearAllFood()
        StaticInstance.uiManager.gameStart(this.midConfig.level)
    }

    clearAllFood() {
        // this.foods.removeAllChildren()
        for (let i = 0; i < this.foods.children.length; i++) {
            const node = this.foods.children[i];
            FoodPoolManager.instance().putNode(node);
        }
        this.foods.removeAllChildren()
    }

    update(dt: number) {
        this.time += dt
        if (this.time > this.checkCD) {
            this.time = 0
            this.checkAllBody()
            this.checkFall()
        }
    }
}

