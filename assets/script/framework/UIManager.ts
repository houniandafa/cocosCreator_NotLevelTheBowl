import { _decorator, Component, Node, Prefab } from 'cc';
import { GameConfig } from '../config/GameConfig';
import { ControlPanel } from '../ui/ControlPanel';
import { LevelInfo } from '../ui/LevelInfo';
import { LevelSelect } from '../ui/LevelSelect';
import { LossPanel } from '../ui/LossPanel';
import { StartMenu } from '../ui/StartMenu';
import { UIBase } from '../ui/UIBase';
import { winPanel } from '../ui/winPanel';
import { UIType } from './Constant';
import { PoolManager } from './PoolManager';
import { StaticInstance } from './StaticInstance';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Prefab) startMenuPrefab: Prefab = null;//开始游戏界面
    @property(Prefab) controlPanelPrefab: Prefab = null;//游戏界面
    @property(Prefab) levelSelectPrefab: Prefab = null;//游戏关卡界面
    @property(Prefab) lossPanelPrefab: Prefab = null;//游戏失败界面
    @property(Prefab) winPanelPrefab: Prefab = null;//游戏赢界面
    @property(Prefab) levelInfoPrefab: Prefab = null;

    uiMap = new Map<UIType, UIBase>();

    start() {
        StaticInstance.setUIManager(this);

        this.initStartMenu();
        this.initControlPanel();
        this.initLevelSelect();
        this.initLossPanel();
        this.initWinPanel();
        this.initLevelInfo();
        this.showUI([UIType.StartMenu])
    }

    gameStart(level: number) {
        this.showUI([UIType.ControlPanel, UIType.LevelInfo])
        StaticInstance.gameManager.gameStart(level)
    }

    showUI(showTypes: UIType[]) {
        this.uiMap.forEach((ui, type) => {
            if (showTypes.indexOf(type) > -1) {
                ui.show()
            } else {
                ui.hide()
            }
        })
    }

    onClickNextLevel() {
        StaticInstance.gameManager.onClickNextLevel()
    }

    setLevelInfo(level: number, nowItem: number) {
        const levelInfo = this.uiMap.get(UIType.LevelInfo) as LevelInfo
        levelInfo.setLevelLabel(level)
        const max = GameConfig[level].length
        levelInfo.setItemsLabel(nowItem, max)
    }

    showGameWinUI() {
        this.showUI([UIType.LevelInfo, UIType.WinPanel])
    }
    //在玩一次
    onClickPlayAgain() {
        StaticInstance.gameManager.onClickPlayAgain()
    }
    //在游戏界面 显示失败界面
    showGameLossUI() {
        this.showUI([UIType.LevelInfo, UIType.LossPanel])
    }

    toLevelSelect() {
        this.showUI([UIType.LevelSelect])
    }

    onClickDownFood() {
        StaticInstance.gameManager.onClickDownFood()
    }

    onClickLeftFood(dt: number) {
        StaticInstance.gameManager.onClickLeftFood(dt)
    }
 
    onClickRightFood(dt: number) {
        StaticInstance.gameManager.onClickRightFood(dt)
    }

    backToStartMenu() {
        StaticInstance.gameManager.clearAllFood()
        StaticInstance.gameManager.hideBowl()
        this.showUI([UIType.StartMenu])
    }

    hideNextLevelButton() {
        const winPanel = this.uiMap.get(UIType.WinPanel) as winPanel
        winPanel.hideNextLevelButton()
    }

    private initStartMenu() {
        const node = PoolManager.instance().getNode(this.startMenuPrefab, this.node);
        node.setPosition(0, 0);
        const comp = node.getComponent(StartMenu)
        comp.init(this)
        this.uiMap.set(UIType.StartMenu, comp)
    }

    private initControlPanel() {
        const node = PoolManager.instance().getNode(this.controlPanelPrefab, this.node);
        node.setPosition(0, 0);
        const comp = node.getComponent(ControlPanel)
        comp.init(this)
        this.uiMap.set(UIType.ControlPanel, comp)
    }

    private initLevelSelect() {
        // const node = cc.instantiate(this.levelSelectPrefab)
        const node = PoolManager.instance().getNode(this.levelSelectPrefab, this.node);
        // this.node.addChild(node)
        node.setPosition(0, 0)
        const comp = node.getComponent(LevelSelect)
        comp.init(this)
        this.uiMap.set(UIType.LevelSelect, comp)
    }

    private initLossPanel() {
        // const node = cc.instantiate(this.lossPanelPrefab)
        // this.node.addChild(node)
        const node = PoolManager.instance().getNode(this.lossPanelPrefab, this.node);
        node.setPosition(0, 0)
        const comp = node.getComponent(LossPanel)
        comp.init(this)
        this.uiMap.set(UIType.LossPanel, comp)
    }

    private initWinPanel() {
        // const node = cc.instantiate(this.winPanelPrefab)
        // this.node.addChild(node)
        const node = PoolManager.instance().getNode(this.winPanelPrefab, this.node);
        node.setPosition(0, 0)
        const comp = node.getComponent(winPanel)
        comp.init(this)
        this.uiMap.set(UIType.WinPanel, comp)
    }

    private initLevelInfo() {
        // const node = cc.instantiate(this.levelInfoPrefab)
        // this.node.addChild(node)
        const node = PoolManager.instance().getNode(this.levelInfoPrefab, this.node);
        node.setPosition(0, 0)
        const comp = node.getComponent(LevelInfo)
        this.uiMap.set(UIType.LevelInfo, comp)
    }

    onRotateFood(angle: number) {
        StaticInstance.gameManager.onRotateFood(angle)
    }
}

