import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io'

const app = createApp({
    data() {
        return {
            user:{
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            const url = `${site}/v2/admin/signin`;
            console.log('user', this.user);
            axios.post(url, this.user)
                .then( res => {
                    console.log(res);
                    const { expired, token } =res.data
                    //將 token 和 expired 寫到 cookie
                    document.cookie = `yokoToken=${token}; expires=${new Date(expired)}`;
                    window.location = './products.html';
                })
                .catch( err => {
                    console.log(err);
                })
        },
    },
    mounted() {
        console.log('hello')
    },
});

app.mount('#app');