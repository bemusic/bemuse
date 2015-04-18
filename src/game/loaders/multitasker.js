
import Observable   from 'bemuse/observable'
import Progress     from 'bemuse/progress'
import { throttle } from 'lodash'

export function start(callback) {

  let tasks = { }
  let running = { }
  let taskList = [ ]

  function task(name, text, dependencies, f) {
    let progress = new Progress()
    if (text) taskList.push({ text, progress })
    tasks[name] = function() {
      return Promise.all(dependencies.map(run)).then(deps =>
        f(...deps.concat([progress])))
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
    return taskList.map(task => {
      return {
        text:         task.text,
        progress:     task.progress.progress,
        progressText: task.progress.toString(),
      }
    })
  }

  let promise = callback(task, run)
  let status = new Observable(getTaskStatuses())
  let update = throttle(function updateTaskStatuses() {
    status.value = getTaskStatuses()
  }, 16)

  for (let taskToWatch of taskList) {
    taskToWatch.progress.watch(update)
  }

  return { tasks: status, promise: promise }

}
