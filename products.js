import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io';
const api_path = 'yokozeng-vue';

const app = createApp({
    data(){
        return {
            products: [],
            tempProduct: {}
        }
    },
    methods: {
        //確認登入狀態
        checkLogin(){
            const url = `${site}/v2/api/user/check`
            axios.post(url)
                .then( res => {
                    console.log(res);
                    this.getProducts();
                })
                .catch( err => {
                    console.log(err);
                })
        },
        //取得產品列表
        getProducts(){
            const url = `${site}/v2/api/${api_path}/admin/products/all`;
            axios.get(url)
                .then( res =>{
                    console.log(res);
                    this.products=res.data.products
                })
                .catch( err => {
                    console.log(err);
                })
        }
    },
    mounted() {
        //取得cookie裡的token
        const cookieToken = document.cookie
            .split('; ')
            .find( (row)=> row.startsWith('yokoToken='))
            ?.split('=')[1];
        //console.log('cookieToken',cookieToken)
        //將 token 加進 axios 的 headers上，之後執行 axios 時都會自動帶上 token!
        axios.defaults.headers.common['Authorization'] = cookieToken;
        this.checkLogin();
    },
});

app.mount('#app');