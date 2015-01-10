
module.exports = Notes

var CHANNEL_MAPPING = {
  IIDX_P1: {
    '11': { column: '1'  },
    '12': { column: '2'  },
    '13': { column: '3'  },
    '14': { column: '4'  },
    '15': { column: '5'  },
    '18': { column: '6'  },
    '19': { column: '7'  },
    '16': { column: 'SC' },
  },
}

function Notes(notes) {
  this._notes = notes
}

Notes.prototype.count = function() {
  return this._notes.length
}

Notes.prototype.all = function() {
  return this._notes.slice()
}

Notes.fromBMSChart = function(chart, options) {
  options = options || { }
  var builder = new BMSNoteBuilder(chart)
  return builder.build()
}


function BMSNoteBuilder(chart) {
  this._chart = chart
}

BMSNoteBuilder.prototype.build = function() {
  this._notes = []
  this._activeLN = { }
  this._channelMapping = CHANNEL_MAPPING.IIDX_P1
  this._objects = this._chart.objects.allSorted()
  this._objects.forEach(function(object) {
    this._handle(object)
  }.bind(this))
  return new Notes(this._notes)
}

BMSNoteBuilder.prototype._handle = function(object) {
  switch (object.channel.charAt(0)) {
  case '1': case '2':
    this._handleNormalNote(object)
    break
  case '5': case '6':
    this._handleLongNote(object)
    break
  }
}

BMSNoteBuilder.prototype._handleNormalNote = function(object) {
  var channel = this._normalizeChannel(object.channel)
  var beat = this._getBeat(object)
  this._notes.push({ 
    beat: beat,
    column: this._getColumn(channel),
    keysound: object.value,
  })
}

BMSNoteBuilder.prototype._handleLongNote = function(object) {
  var channel = this._normalizeChannel(object.channel)
  var beat = this._getBeat(object)
  if (this._activeLN[channel]) {
    var note = this._activeLN[channel]
    note.endBeat = beat
    this._notes.push(note)
    ;delete this._activeLN[channel]
  } else {
    this._activeLN[channel] = {
      beat: beat,
      keysound: object.value,
      column: this._getColumn(object.channel),
    }
  }
}

BMSNoteBuilder.prototype._getBeat = function(object) {
  return this._chart.measureToBeat(object.measure, object.fraction)
}

BMSNoteBuilder.prototype._getColumn = function(channel) {
  return this._channelMapping[channel]
}

BMSNoteBuilder.prototype._normalizeChannel = function(channel) {
  return channel.replace(/^5/, '1').replace(/^6/, '2')
}

