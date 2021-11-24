import firebase from "firebase/app"
import "firebase/analytics"
import env from "@sc/lib-env"

const configs = {
  US: {
    apiKey: "AIzaSyDVCClPwu2FxTD75oqr61dGmKD5Ks_Yu_U",
    authDomain: "smartcinema-1557754304202.firebaseapp.com",
    databaseURL: "https://smartcinema-1557754304202.firebaseio.com",
    projectId: "smartcinema-1557754304202",
    storageBucket: "smartcinema-1557754304202.appspot.com",
    messagingSenderId: "759513013181",
    appId: "1:759513013181:web:0332e5b900f992cffed0d4",
    measurementId: "G-7QJR31K2EZ"
  },
  TW: {
    apiKey: "AIzaSyDVCClPwu2FxTD75oqr61dGmKD5Ks_Yu_U",
    authDomain: "smartcinema-1557754304202.firebaseapp.com",
    databaseURL: "https://smartcinema-1557754304202.firebaseio.com",
    projectId: "smartcinema-1557754304202",
    storageBucket: "smartcinema-1557754304202.appspot.com",
    messagingSenderId: "759513013181",
    appId: "1:759513013181:web:e192949dcf538aaffed0d4",
    measurementId: "G-REGYEVPQYF"
  }
}

const { overseas = "US" } = env.browser

var firebaseConfig = configs[overseas] || configs["US"]
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

let baseData = {}

const logger = {
  setBaseData (data = {}) {
    baseData = data
  },
  log (event, data) {
    firebase.analytics().logEvent(event, { ...baseData, ...data })
  }
}

export default logger
