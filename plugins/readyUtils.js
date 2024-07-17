import { jobs as webpushJobs, loadJob as webPushLoadJob } from '@/assets/js/webpushUtils'

const queueJob = [addJob(...webPushLoadJob), addJob(...webpushJobs)]

function addJob(check, job) {
  return (queueJob, index, options) => {
    if (job.ready) return
    if (check(options)) {
      job.ready = true
      job(options)
      queueJob.splice(index, 1)
    }
  }
}

function flushJob(time, queueJob, options) {
  setTimeout(() => {
    queueJob.forEach((item, index) => item(queueJob, index, options))
    if (queueJob.length) {
      const base = 10 ** `${time}`.length
      time = Math.ceil(time / base) * (base / 10) + time
      flushJob(time, queueJob, options)
    }
  }, time * 1000)
}

export default (options) => {
  // 执行任务
  // flushJob(1, options)
  flushJob(1, queueJob, options)
}
