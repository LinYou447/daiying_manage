import { createWebHistory, createRouter } from 'vue-router'
import Login from '../components/Login.vue'
import Home from "@/components/Home.vue";
import User from "@/components/User.vue";
import Enterprise from "@/components/Enterprise.vue";
import Position from "@/components/Position.vue";
import Entry from "@/components/Entry.vue";
import EnterpriseManage from "@/components/EnterpriseManage.vue";
import PositionManage from "@/components/PositionManage.vue";
import RoleManage from "@/components/RoleManage.vue";
import ManageMessage from "@/components/ManageMessage.vue";
import EditManage from "@/components/EditManage.vue";
// import Router from 'vue-router';
const routes = [
    {
        path:'/',
        name:'Login',
        hidden: false,
        component:Login
    },{
        path:'/home',
        name:'Home',
        hidden: false,
        component:Home,
        children: [
            {
                path:'/user',
                name:'User',
                hidden: false,
                component:User
            },{
                path:'/enterprise',
                name:'Enterprise',
                hidden: false,
                component:Enterprise
            },{
                path:'/position',
                name:'Position',
                hidden: false,
                component:Position
            },{
                path:'/entry',
                name:'Entry',
                hidden: false,
                component:Entry
            },{
                path:'/enterpriseManage',
                name:'EnterpriseManage',
                hidden: false,
                component:EnterpriseManage
            },{
                path:'/positionManage',
                name:'PositionManage',
                hidden: false,
                component:PositionManage
            },{
                path:'/roleManage',
                name:'RoleManage',
                hidden: false,
                component:RoleManage
            },{
                path:'/manageMessage',
                name:'ManageMessage',
                hidden: false,
                component:ManageMessage
            },{
                path:'/editManage',
                name:'EditManage',
                hidden: false,
                component:EditManage
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
});

export default router;