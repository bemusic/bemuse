import Observable from 'bemuse/utils/observable'
import Progress from 'bemuse/progress'
import { throttle } from 'lodash'

export function start(callback) {
  const tasks = {}
  const running = {}
  const taskList = []

  function task(name, text, dependencies, f) {
    const progress = new Progress()
    if (text) taskList.push({ text, progress })
    tasks[name] = function () {
      return Promise.all(dependencies.map(run)).then((deps) =>
        f(...deps.concat([progress]))
      )
    }
  }

  function bar(text, progress) {
    taskList.push({ text, progress })
  }

  task.bar = bar

  function run(name) {
    return running[name] || (running[name] = tasks[name]())
  }

  function getTaskStatuses() {
    return taskList.map((t) => {
      return {
        text: t.text,
        progress: t.progress.progress,
        progressText: t.progress.toString(),
      }
    })
  }

  const promise = callback(task, run)
  const status = new Observable(getTaskStatuses())
  const update = throttle(function updateTaskStatuses() {
    status.value = getTaskStatuses()
  }, 16)

  for (const taskToWatch of taskList) {
    taskToWatch.progress.watch(update)
  }

  return { tasks: status, promise: promise, get: run }
}
