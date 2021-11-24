const utils = {}
utils.countdown = function (options) {
  let opts = {
    total: 10000,
    timespan: 1000,
    appear: true,
    timechange: function () {},
    ended: function () {},
    ...options
  }
  let leave = 0
  const once = () => {
    let remain = opts.total - leave
    opts.timechange({ remain, leave, total: opts.total })
    if (remain <= 0) {
      opts.ended({ remain, leave, total: opts.total })
      timer && clearInterval(timer)
      timer = null
    }
  }
  let timer = setInterval(() => {
    leave += opts.timespan
    once()
  }, opts.timespan)
  if (opts.appear) {
    once()
  }
}

export default utils
