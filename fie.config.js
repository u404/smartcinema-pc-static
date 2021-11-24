"use strict"

module.exports = {
  toolkit: "fie-toolkit-vue",

  toolkitConfig: {
    overseas: true,
    group: "fe-international",

    /**
     * publishPages配置页面发布（必须）
     * outputPath {string} 对应dist目录 例如：index.html
     * publicPath {string} 对应根域名 例如：test/index.html
     * description {string} 页面描述
     */
    publishPages: [
      {
        outputPath: "index.html",
        publicPath: "web-st/index.html",
        description: ""
      },
      {
        outputPath: "sign-in.html",
        publicPath: "web-st/sign-in.html",
        description: ""
      },
      {
        outputPath: "movie.html",
        publicPath: "web-st/movie.html",
        description: ""
      }
    ]
  },

  configureWebpack: {
    resolve: {
      mainFields: ["main", "browser", "module"] // 配置优先解析main
    },
    externals: {
      vue: "Vue",
      vuex: "Vuex"
    },
    plugins: [
    ],
    optimization: {
      minimize: false
    }
  },

  css: {
    loaderOptions: {
      sass: {
        data: `@import "src/common/style/mixins.scss";`
      }
    },
    modules: false
  },

  // 多页开发使用 pages选项
  pages: {
    index: {
      entry: "src/pages/index/main.js",
      template: "src/pages/index/index.html",
      filename: "index.html"
    },
    movie: {
      entry: "src/pages/movie/main.js",
      template: "src/pages/movie/index.html",
      filename: "movie.html"
    },
    activity: {
      entry: "src/pages/activity/main.js",
      template: "src/pages/activity/index.html",
      filename: "activity.html"
    },
    "sign-in": {
      entry: "src/pages/sign-in/main.js",
      template: "src/pages/sign-in/index.html",
      filename: "sign-in.html"
    }
  },

  devServer: {
    proxy: {
      "/": {
        ws: false,
        target: "https://aws-api.smartcinemausa.com/",
        changOrigin: true
      }
    }
  }
}
