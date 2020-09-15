import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);
export const asyncRoutes = [
  {
    path: "/log",
    component: Layout,
    children: [
      {
        path: "log",
        name: "log",
        component: () => import("@/views/logmanage/index"),
        meta: { title: "日志管理", icon: "bug", roles: ["admin"] }
      }
    ]
  },
  {
    path: "/website",
    component: Layout,
    children: [
      {
        path: "website",
        name: "关于网站",
        component: () => import("@/views/website/index"),
        meta: { title: "关于网站", icon: "guide" }
      }
    ]
  }
];
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "首页",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/article",
    component: Layout,
    name: "Article",
    meta: {
      title: "文章",
      icon: "file-manage"
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/article/articleList"),
        name: "ArticleList",
        meta: { title: "文章列表" }
      },
      {
        path: "/create",
        query: new Date(),
        component: () => import("@/views/article/create"),
        name: "新建文章",
        meta: { title: "新建文章" }
      }
    ]
  },
  {
    path: "/sitemap",
    name: "Sitemap",
    component: Layout,
    meta: {
      title: "标签分类",
      icon: "table"
    },
    children: [
      {
        path: "category",
        name: "分类",
        component: () => import("@/views/sitemap/category"),
        meta: { title: "分类" }
      },
      {
        path: "tag",
        name: "标签",
        component: () => import("@/views/sitemap/tag"),
        meta: { title: "标签" }
      }
    ]
  },

  {
    path: "/profile",
    component: Layout,
    hidden: false,
    children: [
      {
        path: "profile",
        name: "个人中心",
        component: () => import("@/views/profile/index"),
        meta: { title: "个人中心", icon: "user" }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  }
];
const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });
const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
