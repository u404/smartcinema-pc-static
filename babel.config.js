module.exports = {
  presets: [
    [
      "@vue/app",
      {
        useBuiltIns: "usage",
        targets: {
          "chrome": "58",
          "ie": "11",
          "safari": "10"
        }
      }
    ]
  ]
}
