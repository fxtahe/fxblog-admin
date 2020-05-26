import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const categoryRouter = {
  route: null,
  name: null,
  title: "分类管理",
  type: "folder",
  icon: "el-icon-collection-tag",
  filePath: "views/category/",
  order: null,
  inNav: true,
  children: [
    {
      title: "分类管理",
      type: "view",
      name: "category",
      route: "/category/category",
      filePath: "views/category/category.vue",
      inNav: true,
      icon: ""
    },
    {
      title: "标签管理",
      type: "view",
      name: "tag",
      route: "/category/tag",
      filePath: "views/category/tag.vue",
      inNav: true,
      icon: ""
    }
  ]
};
const routes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/article",
    component: Layout,
    name: "Article",
    meta: {
      title: "Article",
      icon: "file-manage"
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/article/articleList"),
        name: "ArticleList",
        meta: { title: "Article List", icon: "list" }
      },
      {
        path: "/create",
        query: new Date(),
        component: () => import("@/views/article/create"),
        name: "Create",
        meta: { title: "Create Article", icon: "edit" }
      }
    ]
  },
  {
    path: "/sitemap",
    name: "Sitemap",
    component: Layout,
    meta: {
      title: "Sitemap",
      icon: "tag"
    },
    children: [
      {
        path: "category",
        name: "Category",
        component: () => import("@/views/sitemap/category"),
        meta: { title: "Category", icon: "dashboard" }
      },
      {
        path: "tag",
        name: "Tag",
        component: () => import("@/views/sitemap/tag"),
        meta: { title: "Tag", icon: "dashboard" }
      }
    ]
  },
  {
    path: "/about",
    component: Layout,
    children: [
      {
        path: "about",
        name: "About",
        component: () => import("@/views/about/index"),
        meta: { title: "About", icon: "dashboard" }
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
        name: "Profile",
        component: () => import("@/views/profile/index"),
        meta: { title: "Profile", icon: "user" }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
