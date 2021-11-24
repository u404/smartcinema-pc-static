import Vue from "vue"
import Router from "vue-router"

import Page from "./layouts/Page.vue"
import Home from "./pages/Home.vue"
import SignIn2 from "./pages/SignIn_2.0.vue"

import Movie from "./pages/Movie.vue"

import Exception from "./pages/Exception.vue"

import Activity from "./pages/Activity.vue"

import NotFound from "./pages/NotFound.vue"

Vue.use(Router)

export const navRoutes = [
  {
    path: "", redirect: "home", name: "default"
  },
  {
    title: "Home", path: "/home", name: "home", component: Home
  },
  {
    path: "/movie/:act/:id", name: "movie", component: Movie, props: true
  },
  {
    path: "/exception/:type", name: "exception", component: Exception, props: true
  },
  {
    path: "/activity/:type", name: "activity", component: Activity, props: true
  },
  {
    path: "/notFound", name: "notFound", component: NotFound
  },
  {
    path: "*", redirect: "/notFound"
  }
]

export const signInRoute = {
  title: "Sign in", path: "/sign-in", name: "sign-in", props: true, component: SignIn2
}

export const noNavRoutes = [
  signInRoute
]

export const routes = [
  ...noNavRoutes,
  {
    path: "/",
    name: "page",
    component: Page,
    children: navRoutes
  }

]

const router = new Router({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
