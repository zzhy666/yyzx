<template>
    <div class="bed-diagram-container">
    <div class="top-controls">
        <label style="margin-right: 50px;">
      <span >楼层：</span>
        <el-select v-model="currentFloor" style="width: 300px; position: relative; left: 5px; top: -2px;"@change="handleFloorChange">
           <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </label>
  <div class="stats-row">
    <!-- 第一个总床位的代码 -->
    <div class="stat-card total">
         <img src="/image/jhnlc.png" alt="总床位" style="width: 60px; height: 45px; border-radius: 12px;position: relative;top:-5px; ">  
            <div style="margin-left: 10px;">总床位:</div>
               <div style="margin-left: 10px;" >{{ floorStats.total }}</div>
        </div>
      
      
        <!-- 第二个空床位的代码 -->
      <div class="stat-card available" style="position:relative; left: -150px;">
          <img src="/image/kx.png" alt="空闲" style="width: 60px; height: 45px; border-radius: 12px;position: relative;top:-5px;">
        <div style="margin-left: 10px;">空闲位:</div>
          <div style="margin-left: 10px;">{{ floorStats.available }}</div>
      </div>
      
     <!-- 第三个有人位的代码 -->
      <div class="stat-card occupied" style="position:relative; left: -300px;">
          <img src="/image/lc.png" alt="有人" style="width: 60px; height: 45px; border-radius: 12px;position: relative;top:-5px;">
         <div style="margin-left: 10px;">有人位:</div>
          <div style="margin-left: 10px;">{{ floorStats.occupied }}</div>
      </div>
      
      <!-- 第四个外出位的代码 -->
      <div class="stat-card out"style="position:relative; left: -450px;">
         <img src="/image/wc.png" alt="外出" style="width: 60px; height: 45px; border-radius: 12px;position: relative;top:-5px;">
          <div style="margin-left: 10px;">外出:</div>
           <div style="margin-left: 10px;">{{ floorStats.out }}</div>
      </div>
    </div>
    </div>
    <div style="padding:20px; background:white; border-radius:8px; margin-top:20px;">
      <h3 style="margin:0 0 20px 0; padding-left:10px; border-left:4px solid #007bff;">
        {{ currentFloorLabel }} 平面图
      </h3>
      <div v-if="currentFloor === 1" style="color:#6c757d; margin-bottom:15px; font-size:14px;">
        说明：本层设有活动区、护士站等公共区域，故房间数为13间。
      </div>
      <div v-if="currentFloor === 4" style="color:#6c757d; margin-bottom:15px; font-size:14px;">
        说明：本层设有其他房间的洗衣房等区域。
      </div>

      <!-- 网格布局容器 -->
      <div class="floor-plan-grid-static">
        <!-- 遍历当前楼层的布局定义 -->
        <template v-for="cell in currentFloorLayout" :key="cell.id">
          
          <!-- 如果是房间 -->
          <div v-if="cell.type === 'room'" class="room-cell-static">
            <div class="room-title-static">{{ cell.roomCode }}室</div>
            <div class="beds-container-static">
              <!-- 渲染该房间的两张床 -->
              <div v-for="bed in cell.beds" :key="bed.bedCode" 
                   class="bed-slot-static"
                   :style="{ borderLeftColor: getStatusColor(bed.status) }"
                   :title="`${bed.bedCode} | ${getStatusText(bed.status)}`">
                <img :src="getBedImage(bed.status)" :alt="getStatusText(bed.status)" class="bed-img-static">
                <div class="bed-info-static">
                  <div>床{{ bed.bedLabel }}</div>
                
                </div>
              </div>
            </div>
          </div>

          <!-- 如果是活动区 -->
          <div v-else-if="cell.type === 'activity'" class="activity-cell-static">
            <div>公共活动区</div>
          </div>

          <!-- 如果是空位（用于占位，保持布局整齐） -->
          <div v-else class="empty-cell-static"></div>
        </template>
      </div>
    </div>
        </div>
    
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 1. 楼层配置（静态数据）
const floors = [
  { id: 1, name: '一层', roomCount: 13 },
  { id: 2, name: '二层', roomCount: 18 },
  { id: 3, name: '三层', roomCount: 18 },
  { id: 4, name: '四层', roomCount: 18 },
]

// 2. 响应式状态
const currentFloor = ref(1)  // 当前选中楼层
const allBeds = ref([])      // 所有床位数据

// 3. 楼层选项
const options = ref([
  { value: 1, label: '一层' },
  { value: 2, label: '二层' },
  { value: 3, label: '三层' },
  { value: 4, label: '四层' },
])
const floorLayouts = {
  1: [ // 一楼布局：假设是 3行 x 5列 的网格，最后两个是活动区和空位
    { id: '1-01', type: 'room', roomCode: '101', gridColumn: '1', gridRow: '1' },
    { id: '1-02', type: 'room', roomCode: '102', gridColumn: '2', gridRow: '1' },
    { id: '1-03', type: 'room', roomCode: '103', gridColumn: '3', gridRow: '1' },
    { id: '1-04', type: 'room', roomCode: '104', gridColumn: '4', gridRow: '1' },
    { id: '1-05', type: 'room', roomCode: '105', gridColumn: '5', gridRow: '1' },
    { id: '1-06', type: 'room', roomCode: '106', gridColumn: '1', gridRow: '2' },
    { id: '1-07', type: 'room', roomCode: '107', gridColumn: '2', gridRow: '2' },
    { id: '1-08', type: 'room', roomCode: '108', gridColumn: '3', gridRow: '2' },
    { id: '1-09', type: 'room', roomCode: '109', gridColumn: '4', gridRow: '2' },
    { id: '1-10', type: 'room', roomCode: '110', gridColumn: '5', gridRow: '2' },
    { id: '1-11', type: 'room', roomCode: '111', gridColumn: '1', gridRow: '3' },
    { id: '1-12', type: 'room', roomCode: '112', gridColumn: '2', gridRow: '3' },
    { id: '1-13', type: 'room', roomCode: '113', gridColumn: '3', gridRow: '3' },
    { id: '1-activity', type: 'activity', gridColumn: '4 / 6', gridRow: '3' }, // 活动区占两列
    { id: '1-empty', type: 'empty', gridColumn: '5', gridRow: '3' },
  ],
    2: [ // 二楼布局：3行 x 6列，共18个房间
    { id: '2-01', type: 'room', roomCode: '201', gridColumn: '1', gridRow: '1' },
    { id: '2-02', type: 'room', roomCode: '202', gridColumn: '2', gridRow: '1' },
    { id: '2-03', type: 'room', roomCode: '203', gridColumn: '3', gridRow: '1' },
    { id: '2-04', type: 'room', roomCode: '204', gridColumn: '4', gridRow: '1' },
    { id: '2-05', type: 'room', roomCode: '205', gridColumn: '5', gridRow: '1' },
    { id: '2-06', type: 'room', roomCode: '206', gridColumn: '6', gridRow: '1' },
    { id: '2-07', type: 'room', roomCode: '207', gridColumn: '1', gridRow: '2' },
    { id: '2-08', type: 'room', roomCode: '208', gridColumn: '2', gridRow: '2' },
    { id: '2-09', type: 'room', roomCode: '209', gridColumn: '3', gridRow: '2' },
    { id: '2-10', type: 'room', roomCode: '210', gridColumn: '4', gridRow: '2' },
    { id: '2-11', type: 'room', roomCode: '211', gridColumn: '5', gridRow: '2' },
    { id: '2-12', type: 'room', roomCode: '212', gridColumn: '6', gridRow: '2' },
    { id: '2-13', type: 'room', roomCode: '213', gridColumn: '1', gridRow: '3' },
    { id: '2-14', type: 'room', roomCode: '214', gridColumn: '2', gridRow: '3' },
    { id: '2-15', type: 'room', roomCode: '215', gridColumn: '3', gridRow: '3' },
    { id: '2-16', type: 'room', roomCode: '216', gridColumn: '4', gridRow: '3' },
    { id: '2-17', type: 'room', roomCode: '217', gridColumn: '5', gridRow: '3' },
    { id: '2-18', type: 'room', roomCode: '218', gridColumn: '6', gridRow: '3' },
  ],
  3: [ // 三楼布局：3行 x 6列，共18个房间
    { id: '3-01', type: 'room', roomCode: '301', gridColumn: '1', gridRow: '1' },
    { id: '3-02', type: 'room', roomCode: '302', gridColumn: '2', gridRow: '1' },
    { id: '3-03', type: 'room', roomCode: '303', gridColumn: '3', gridRow: '1' },
    { id: '3-04', type: 'room', roomCode: '304', gridColumn: '4', gridRow: '1' },
    { id: '3-05', type: 'room', roomCode: '305', gridColumn: '5', gridRow: '1' },
    { id: '3-06', type: 'room', roomCode: '306', gridColumn: '6', gridRow: '1' },
    { id: '3-07', type: 'room', roomCode: '307', gridColumn: '1', gridRow: '2' },
    { id: '3-08', type: 'room', roomCode: '308', gridColumn: '2', gridRow: '2' },
    { id: '3-09', type: 'room', roomCode: '309', gridColumn: '3', gridRow: '2' },
    { id: '3-10', type: 'room', roomCode: '310', gridColumn: '4', gridRow: '2' },
    { id: '3-11', type: 'room', roomCode: '311', gridColumn: '5', gridRow: '2' },
    { id: '3-12', type: 'room', roomCode: '312', gridColumn: '6', gridRow: '2' },
    { id: '3-13', type: 'room', roomCode: '313', gridColumn: '1', gridRow: '3' },
    { id: '3-14', type: 'room', roomCode: '314', gridColumn: '2', gridRow: '3' },
    { id: '3-15', type: 'room', roomCode: '315', gridColumn: '3', gridRow: '3' },
    { id: '3-16', type: 'room', roomCode: '316', gridColumn: '4', gridRow: '3' },
    { id: '3-17', type: 'room', roomCode: '317', gridColumn: '5', gridRow: '3' },
    { id: '3-18', type: 'room', roomCode: '318', gridColumn: '6', gridRow: '3' },
  ],
  4: [ // 四楼布局：3行 x 6列，共18个房间
    { id: '4-01', type: 'room', roomCode: '401', gridColumn: '1', gridRow: '1' },
    { id: '4-02', type: 'room', roomCode: '402', gridColumn: '2', gridRow: '1' },
    { id: '4-03', type: 'room', roomCode: '403', gridColumn: '3', gridRow: '1' },
    { id: '4-04', type: 'room', roomCode: '404', gridColumn: '4', gridRow: '1' },
    { id: '4-05', type: 'room', roomCode: '405', gridColumn: '5', gridRow: '1' },
    { id: '4-06', type: 'room', roomCode: '406', gridColumn: '6', gridRow: '1' },
    { id: '4-07', type: 'room', roomCode: '407', gridColumn: '1', gridRow: '2' },
    { id: '4-08', type: 'room', roomCode: '408', gridColumn: '2', gridRow: '2' },
    { id: '4-09', type: 'room', roomCode: '409', gridColumn: '3', gridRow: '2' },
    { id: '4-10', type: 'room', roomCode: '410', gridColumn: '4', gridRow: '2' },
    { id: '4-11', type: 'room', roomCode: '411', gridColumn: '5', gridRow: '2' },
    { id: '4-12', type: 'room', roomCode: '412', gridColumn: '6', gridRow: '2' },
    { id: '4-13', type: 'room', roomCode: '413', gridColumn: '1', gridRow: '3' },
    { id: '4-14', type: 'room', roomCode: '414', gridColumn: '2', gridRow: '3' },
    { id: '4-15', type: 'room', roomCode: '415', gridColumn: '3', gridRow: '3' },
    { id: '4-16', type: 'room', roomCode: '416', gridColumn: '4', gridRow: '3' },
    { id: '4-17', type: 'room', roomCode: '417', gridColumn: '5', gridRow: '3' },
    { id: '4-18', type: 'room', roomCode: '418', gridColumn: '6', gridRow: '3' },
  ],
};
const handleFloorChange = () => {
  console.log('切换楼层，检查数据更新...')
  const savedData = localStorage.getItem('customerBedList')
  if (savedData) {
    allBeds.value = JSON.parse(savedData).map(bed => ({
      id: bed.id,
      floor: parseInt(bed.roomCode.charAt(0)),
      roomCode: bed.roomCode,
      bedLabel: bed.bedLabel,
      bedCode: bed.bedCode,
      status: bed.status,
      customerName: bed.customerName
    }))
  }
  console.log('当前楼层数据已更新')
}

// 添加监听 localStorage 变化的函数
const listenToDataChanges = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'customerBedList') {
      console.log('检测到 localStorage 数据变化，自动刷新床位数据')
      handleFloorChange()  // 数据变化时自动刷新
    }
  })
}
const initializeBedData = () => {
  const beds = [];
  let bedId = 1;
  
  for (let f = 0; f < floors.length; f++) {
    const floor = floors[f];
    for (let roomNum = 1; roomNum <= floor.roomCount; roomNum++) {
      const roomCode = `${floor.id}${roomNum.toString().padStart(2, '0')}`;
      ['A', 'B'].forEach(bedLabel => {
        let status = 'available';
        let customerName = null;
        if (bedId <= 70) {
          status = 'occupied';
          customerName = `客户${bedId}`;
        } else if (bedId <= 110) {
          status = 'available';
        } else if (bedId <= 134) {
          status = 'out';
        }
        beds.push({
          id: bedId++,
          floor: floor.id,
          roomCode: roomCode,
          bedLabel: bedLabel,
          bedCode: `${roomCode}-${bedLabel}`,
          status: status,
          customerName: customerName
        });
      });
    }
  }
  allBeds.value = beds;
  console.log(`床位数据生成完毕，共 ${beds.length} 条`);
};

// --- 4. 计算属性与工具函数 ---
const currentFloorLabel = computed(() => {
  const opt = options.value.find(o => o.value === currentFloor.value);
  return opt ? opt.label : '';
});

const floorStats = computed(() => {
  const beds = allBeds.value;
  return {
    total: beds.length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    available: beds.filter(b => b.status === 'available').length,
    out: beds.filter(b => b.status === 'out').length
  };
});

// **核心计算：将布局定义与床位数据结合**
const currentFloorLayout = computed(() => {
  const layout = floorLayouts[currentFloor.value];
  if (!layout) return [];

  // 获取当前楼层的所有床位
  const bedsThisFloor = allBeds.value.filter(bed => bed.floor === currentFloor.value);

  // 为布局中的每个“房间”单元格，匹配对应的两张床位
  return layout.map(cell => {
    if (cell.type !== 'room') return { ...cell, beds: [] }; // 活动区/空位没有床位

    const roomBeds = bedsThisFloor.filter(bed => bed.roomCode === cell.roomCode);
    return {
      ...cell,
      beds: roomBeds // 这里应该是包含床A和床B的数组
    };
  });
});

// 工具函数
const getBedImage = (status) => ({ available: '/image/kx.png', occupied: '/image/lc.png', out: '/image/wc.png' }[status] || '/image/kx.png');
const getStatusText = (status) => ({ occupied: '有人', available: '空闲', out: '外出' }[status] || status);
const getStatusColor = (status) => ({ occupied: '#f56c6c', available: '#67c23a', out: '#e6a23c' }[status] || '#909399');

// --- 5. 生命周期 ---
onMounted(() => {
  console.log('组件挂载，初始化数据...');
  initializeBedData();
  const savedData = localStorage.getItem('customerBedList')
  if (savedData) {
    console.log('从 localStorage 找到床位数据，覆盖默认数据')
    try {
      const bedData = JSON.parse(savedData)
      allBeds.value = bedData.map(bed => ({
        id: bed.id,
        floor: parseInt(bed.roomCode.charAt(0)),
        roomCode: bed.roomCode,
        bedLabel: bed.bedLabel,
        bedCode: bed.bedCode,
        status: bed.status,
        customerName: bed.customerName
      }))
    } catch (error) {
      console.error('解析 localStorage 数据失败:', error)
    }
  }
  
  // 3. 开始监听数据变化
  listenToDataChanges()
  
  // 4. 手动刷新一次当前楼层数据
  handleFloorChange()
});

</script>


<style scoped>
.stats-row {
  display: flex;
  flex: 1;                    /* 占据剩余空间 */
  gap: 5px;                  /* 卡片间距适中，不要太大 */
  justify-content: space-between;
  align-items: center;
}
.stat-card {
 display: flex;
 align-items: center;

}      
.top-controls {
  display: flex;              /* 启用flex布局 */
  align-items: center;        /* 垂直居中 */
  gap: 20px;                  /* 控制间距，不要太大 */
  margin-bottom: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.floor-plan-grid-static {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5列网格 */
  gap: 12px;
}
.room-cell-static {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}
.room-title-static {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}
.beds-container-static {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
  justify-content: center;
}
.bed-slot-static {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 4px;
  background: white;
  border-left: 4px solid; /* 颜色由js动态绑定 */
  gap: 8px;
}
.bed-img-static {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.bed-info-static {
  font-size: 16px; /* 增大字体 */
  font-weight: bold; /* 加粗 */
  text-align: center; /* 居中 */
  width: 100%; /* 占满宽度 */
}

.activity-cell-static {
  grid-column: span 2; /* 活动区占两列宽度 */
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  font-weight: bold;
  color: #666;
}
.empty-cell-static {
  /* 占位格子，可以保持透明或有一点背景 */
  background-color: transparent;
}

</style>