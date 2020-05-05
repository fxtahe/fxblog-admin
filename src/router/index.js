import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout";

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
      icon: "documentation"
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/article/articleList"),
        name: "ArticleList",
        meta: { title: "Article List", icon: "list" }
      },
      {
        path: "edit",
        component: () => import("@/views/article/edit"),
        name: "Edit",
        meta: { title: "Edit Article", icon: "edit" }
      }
    ]
  },
  {
    path: "/example",
    component: Layout,
    redirect: "/example/list",
    name: "Example",
    meta: {
      title: "Example",
      icon: "example"
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/article/articleList/article-list"),
        name: "ArticleList",
        meta: { title: "Article List", icon: "list" }
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
    path: "/sitemap",
    name: "Sitemap",
    component: Layout,
    meta: {
      title: "Sitemap",
      icon: "example"
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
  }
];

const router = new VueRouter({
  routes
});

export default router;
