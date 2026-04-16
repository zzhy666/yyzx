import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Loyat from '../views/loyat.vue'
import Bed from '../views/Bed.vue'
import BedHeader from '../views/BedHeader.vue'
import Client from '../views/Client.vue'
import ClientHeader from '../views/ClientHeader.vue'
import Basicdata from '../views/Basicdata.vue'
import BasicdataHeader from '../views/BasicdataHeader.vue'
import NurseItem from '../views/Nurse/NurseItem.vue'
import Healthy from '../views/Healthy.vue'
import HealthyHeader from '../views/HealthyHeader.vue'
import NurseHeader from '../views/Nurse/NurseHeader.vue'
import NurseLevel from '../views/Nurse/NurseLevel.vue'
import NurseRecords from '../views/Nurse/NurseRecords.vue'
import NurseSetting from '../views/Nurse/NurseSetting.vue'
import Clientout from '../views/Clientout.vue'
import Clientoff from '../views/Clientoff.vue'
import BedManagement from '../views/BedManagement.vue'
const routes = [
    {
        path:'/',
        redirect:'/login'
    },
  {
    path:'/login',
    name:'login',
    component:Login
  },
{
    path:'/loyat',
    name:'loyat',
    component:Loyat,
    children:[{
      path:'bed',
      name:'bed',
      components:{
        default: Bed,   
        header: BedHeader 
      }
    },
    {
      path:'bedmanagement',
      name:'bedmanagement',
      components:{
      default: BedManagement,
      header: BedHeader 
    }
    },
    {
      path:'client',
      name:'client',
      components:{
        default: Client,   
        header: ClientHeader 
      }
    },{
      path:'clientout',
      name:'clientout',
      components:{
        default: Clientout,   
        header: ClientHeader  
      }
    },
    {
      path:'clientoff',
      name:'clientoff',
      components:{
        default: Clientoff,   
        header: ClientHeader  
    },
  },
    {
      path:'basicdate',
      name:'basicdate',
      components:{
        default: Basicdata,  
        header: BasicdataHeader 
      }
    },
    {
      path:'nurseItem',
      name:'nurseItem',
      components:{
        default: NurseItem,
        header: NurseHeader   
      }
    },
    {
      path:'nurseLevel',
      name:'nurseLevel',
      components:{
        default: NurseLevel,
        header: NurseHeader   
      }
    },
    {
      path:'nurseRecords',
      name:'nurseRecords',
      components:{
        default: NurseRecords,
        header: NurseHeader   
      }
    },
    {
      path:'nurseSetting',
      name:'nurseSetting',
      components:{
        default: NurseSetting,
        header: NurseHeader   
      }
    },
    {
      path:'healthy',
      name:'healthy',
      components:{
        default: Healthy,
        header: HealthyHeader 
      }
    }
  ]
    }
    
  ]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
