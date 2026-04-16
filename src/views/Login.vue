<template>
    <div class="picture">
        <h1>东软颐养中心</h1>
    </div>
    <h2>请登录</h2>
    <el-row>
        <el-col :span="8" :offset="13" class="zt">
            <el-form :model="formData" ref="formData" class="one">
                <el-input v-model="formData.username" prefix-icon="User" placeholder="请输入用户名" style="height: 60px"
                    @input="checkButtonStatus"> </el-input>
                <el-input v-model="formData.password" prefix-icon="tools" placeholder="请输入密码" show-password
                    style="margin-top: 30px;height: 60px"  @input="checkButtonStatus"> </el-input>
                <el-radio-group v-model="selectusertype" style="margin-top: 30px;">
                    <el-radio :value="1">管理员</el-radio>
                    <el-radio :value="2">护工</el-radio>
                </el-radio-group><br>
                <el-button @click="handlelogin" native-type="submit" class="submit-btn" type="primary" round
                    :disabled="ismatch">登录</el-button>
            </el-form>
        </el-col>
    </el-row>
    <div class="picture2"></div>
</template>
<script>

export default {
    name: 'Login',
    data() {
        return {
            formData: {
                username: '',
                password: '',
                usertype: [{
                    value: 1,
                    label: '管理员'
                }, {
                    value: 2,
                    label: '护工'
                }
                ]
            },
            selectusertype: 1,
            ismatch: true,
            userList: [{
                username: "admin",
                password: "admin"
            },
            {
                username: "admin2",
                password: "admin2"
            }, {
                username: "admin3",
                password: "admin3"
            }
            ]
        }

    },

    methods: {
        checkButtonStatus() {
            const hasContent = this.formData.username.trim() !== '' &&
                this.formData.password.trim() !== '';
            this.ismatch = !hasContent;
        },


        handlelogin() {
            let isValid = false;
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].username === this.formData.username &&
                    this.userList[i].password === this.formData.password) {
                    isValid = true;
                    break;
                }
            }
                if (isValid) {
                    this.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 5000,
                    });
                    localStorage.setItem('currentUsername', this.formData.username);
                    localStorage.setItem('userType', this.selectusertype === 1 ? '管理员' : '护工');
                    if (this.selectusertype === 1) {
                   this.$router.push('/loyat');  
                } else {
                   this.$router.push('/hugong');
                }
                }
               
                
                else {
                    this.$message({
                        message: '用户名或密码错误',
                        type: 'error',
                        duration: 5000
                    });
                }

            
        }
    }
}


</script>

<style>
.submit-btn {
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;
    /* 字母间隔 */
    margin-top: 20px;
}

.picture {
    text-align: left;
    width: 100%;
    height: 100px;
    background-image: url("/image/OIP-C.webp");


}

.zt {
    position: relative;
    top: 250px;
}

h1 {
    position: relative;
    left: 20px;
    top: 20px;
    z-inde: 1;
    color: white;
}

.picture2 {
    background-image: url(/image/4.jpg);
    position: relative;
    width: 40%;
    height: 800px;
    left: 5%;
    top: -400px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

}

h2 {
    position: relative;
    left: 1300px;
    top: 100px;
    font-size: 50px;
}

.one {
    position: relative;
    top: -100px;
}
</style>