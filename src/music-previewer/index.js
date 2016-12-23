let instance = null

function getInstance () {
  return instance || (instance = createMusicPreviewer())
}

export function preload () {
  getInstance()
}

export function enable () {
  return getInstance().enable()
}

export function disable () {
  return getInstance().disable()
}

export function go () {
  return getInstance().go()
}

export function preview (url) {
  return getInstance().preview(url)
}

function createFader (audio, initialVolume, onTargetReached) {
  let targetVolume = 0
  let currentSpeed = 0
  let requested = false
  let volumeChanged
  audio.volume = initialVolume

  function elapsed () {
    return (Date.now() - volumeChanged) / 1000
  }

  function getCurrentVolume () {
    if (targetVolume > initialVolume) {
      return Math.min(targetVolume, initialVolume + elapsed() * currentSpeed)
    }
    if (targetVolume < initialVolume) {
      return Math.max(targetVolume, initialVolume - elapsed() * currentSpeed)
    }
    return targetVolume
  }

  function update () {
    requested = false
    const currentVolume = getCurrentVolume()
    audio.volume = currentVolume
    if (currentVolume === targetVolume) {
      if (onTargetReached) onTargetReached(targetVolume)
    } else {
      if (!requested) {
        requested = true
        requestAnimationFrame(update)
      }
    }
  }

  return {
    fadeTo (target, speed) {
      if (targetVolume !== target || speed !== currentSpeed) {
        initialVolume = getCurrentVolume()
        targetVolume = target
        currentSpeed = speed
        volumeChanged = Date.now()
        update()
      }
    }
  }
}

function createMusicPreviewer () {
  let enabled = false
  let currentUrl = null
  let backgroundLoaded = false
  let backgroundPlayed = false
  const instances = { }

  const background = new Audio(require('./default.ogg'))
  background.preload = 'auto'
  background.loop = true
  background.oncanplaythrough = () => {
    backgroundLoaded = true
    update()
  }
  background.load()

  const goSound = document.createElement('audio')
  goSound.src = require('./go.ogg')
  goSound.volume = 0.5
  goSound.load()

  const backgroundFader = createFader(background, 0.5, (target) => {
    if (target === 0 && backgroundPlayed) {
      backgroundPlayed = false
      background.pause()
    }
  })

  function update () {
    if (!enabled) {
      if (backgroundPlayed) {
        backgroundFader.fadeTo(0, 100)
        backgroundPlayed = false
        background.pause()
      }
      for (const key of Object.keys(instances)) {
        const instance = instances[key]
        instance.destroy()
      }
      return
    }
    let playing = null
    for (const key of Object.keys(instances)) {
      const instance = instances[key]
      if (key === currentUrl) {
        if (instance.loaded) {
          instance.play()
          playing = instance
        }
      } else {
        instance.stop()
      }
    }
    if (playing) {
      backgroundFader.fadeTo(0, 1)
    } else {
      backgroundFader.fadeTo(0.4, 0.5)
      if (backgroundLoaded && !backgroundPlayed) {
        backgroundPlayed = true
        try {
          background.play()
        } catch (e) {
          console.warn('Cannot play background music')
        }
      }
    }
  }

  const musicPreviewer = {
    enable () {
      if (enabled) return
      enabled = true
      update()
    },
    disable () {
      if (!enabled) return
      enabled = false
      update()
    },
    go () {
      if (!enabled) return
      goSound.currentTime = 0
      try {
        goSound.play()
      } catch (e) {
        console.warn('Cannot play go sound.')
      }
    },
    preview (songUrl) {
      if (currentUrl === songUrl) return
      currentUrl = songUrl
      if (songUrl && !instances[songUrl]) {
        instances[songUrl] = createInstance(songUrl)
      }
      update()
    }
  }

  function createInstance (songUrl) {
    const audio = document.createElement('audio')
    audio.src = songUrl
    let played = false

    const fader = createFader(audio, 1, (target) => {
      if (target === 0) {
        audio.pause()
        delete instances[songUrl]
        update()
      }
    })

    const instance = {
      loaded: false,
      play () {
        if (!played) {
          try {
            audio.play()
            played = true
          } catch (e) {
            console.warn('Cannot play', audio.src)
          }
        }
        fader.fadeTo(1, 2)
      },
      stop () {
        fader.fadeTo(0, 4)
      },
      destroy () {
        audio.pause()
        delete instances[songUrl]
        update()
      }
    }

    audio.oncanplaythrough = () => {
      instance.loaded = true
      update()
    }
    audio.onended = () => {
      delete instances[songUrl]
      update()
    }
    audio.load()

    return instance
  }

  return musicPreviewer
}
