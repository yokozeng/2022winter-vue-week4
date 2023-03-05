import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const site = "https://vue3-course-api.hexschool.io";
const api_path = "yokozeng-vue";

let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      addProductData: {
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        imagesUrl: [],
      },
      isAdd: false, //true為新增；false為編輯
    };
  },
  mounted() {
    //取得cookie裡的token
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("yokoToken="))
      ?.split("=")[1];
    //console.log('cookieToken',cookieToken)
    //將 token 加進 axios 的 headers上，之後執行 axios 時都會自動帶上 token!
    axios.defaults.headers.common["Authorization"] = cookieToken;
    this.checkLogin();

    //Modal 初始化
    productModal = new bootstrap.Modal("#productModal");
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
  methods: {
    /*確認登入狀態*/
    checkLogin() {
      const url = `${site}/v2/api/user/check`;
      axios
        .post(url)
        .then((res) => {
          //console.log(res);
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
          window.location = "./login.html";
        });
    },

    /*取得產品列表*/
    getProducts() {
      const url = `${site}/v2/api/${api_path}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /*新增產品的彈窗控制*/
    openAddProductModal(status, product) {
      if (status === "add") {
        //新增
        productModal.show();
        this.isAdd = true;
        this.addProductData = {
          title: "",
          category: "",
          origin_price: 0,
          price: 0,
          unit: "",
          description: "",
          content: "",
          is_enabled: 0,
          imageUrl: "",
          imagesUrl: [],
        };
      } else if (status === "edit") {
        //編輯
        productModal.show();
        this.isAdd = false;
        this.addProductData = { ...product }; //一定要展開！
      } else if (status === "delete") {
        delProductModal.show();
        this.addProductData = { ...product }; //一定要展開！
      }
    },

    /*新增or編輯 產品*/
    updatedProduct() {
      let url;
      let method;
      if (this.isAdd) {
        //新增
        url = `${site}/v2/api/${api_path}/admin/product`;
        method = "post";
      } else if (!this.isAdd) {
        //編輯
        url = `${site}/v2/api/${api_path}/admin/product/${this.addProductData.id}`;
        method = "put";
      }

      axios[method](url, { data: this.addProductData })
        .then((res) => {
          //console.log(res);
          productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },

    /*新增圖片*/
    addImg() {
      const imagesUrl = this.addProductData.imagesUrl
        ? [...this.addProductData.imagesUrl]
        : [];
      imagesUrl.push("");
      this.addProductData.imagesUrl = imagesUrl;
    },

    /*刪除圖片*/
    deleteImg(key) {
      //   this.addProductData.imagesUrl.splice(key, 1);

      const imagesUrl = [...this.addProductData.imagesUrl];
      imagesUrl.splice(key, 1);
      this.addProductData.imagesUrl = imagesUrl;
    },

    /*刪除 產品*/
    deleteProduct() {
      const url = `${site}/v2/api/${api_path}/admin/product/${this.addProductData.id}`;
      axios
        .delete(url)
        .then(() => {
          this.getProducts();
          delProductModal.hide();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
});

app.mount("#app");
