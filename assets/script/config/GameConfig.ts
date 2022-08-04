import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏关卡数据，这里简单配置，数组从第一关开始依次排
 * 0 代表鸡翅
 * 1 代表鸡蛋
 * 2 代表蛋糕
 * 3 代表饭团
 * 4 代表薯条
 * 5 代表汉堡
 */

// @ccclass('GameConfig')
// export class GameConfig {

// }

export const GameConfig = [
    // 0 无数据
    [],
    // 第一关：2个蛋糕
    [2, 2],
    // 第二关：3个鸡翅
    [0, 0, 0],
    // 第三关：2个蛋糕 2个鸡蛋
    [2, 2, 1, 1],
    // 第四关：4个汉堡
    [5, 5, 5, 5],
    // 第五关：4个薯条
    [4, 4, 4, 4],
    // 第六关：5个饭团
    [3, 3, 3, 3, 3]
]

