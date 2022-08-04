import { director, ERigidBody2DType, ERigidBodyType, Node, PhysicsSystem2D, RigidBody, RigidBody2D, Vec2, Vec3 } from "cc"

/** 物理系统管理类 */
export class PhysicsManager {
 
    static openPhysicsSystem() {
        // director.getPhysicsManager().enabled = true; //开启物理系统
        PhysicsSystem2D.instance.enable = true; //开启物理系统
    }
 
    static closePhysicsSystem() {
        // director.getPhysicsManager().enabled = false; //关闭物理系统
        PhysicsSystem2D.instance.enable = true; //关闭物理系统
    }
    //设置刚体类型
    static setRigidBoyStatic(node: Node) {
        const body = node.getComponent(RigidBody2D)//必须在ui里面添加RigidBody2D，不然会报错
        body.type = ERigidBody2DType.Static;//零质量，零速度，可以手动移动
    }
    //设置刚体类型
    static setRigidBoyDynamic(node: Node) {
        const body = node.getComponent(RigidBody2D)
        body.type = ERigidBody2DType.Dynamic;//有质量，可以设置速度，力等。
    }
 
    static setRigidBoyLinearVelocity(node: Node, v: Vec2) {
        const body = node.getComponent(RigidBody2D)
        // body.setLinearVelocity = v
        body.linearVelocity = v//设置刚体速度
    }
 
}