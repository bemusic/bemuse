
var Joi = require('joi')

var Bmson = { }

Bmson.topLevel = () => Joi.object({
  version:          Joi.string().required(),
  info:             Bmson.info().required(),
  lines:            Joi.array().items(Bmson.barLine()),
  bpm_events:       Joi.array().items(Bmson.bpmEvent()),
  stop_events:      Joi.array().items(Bmson.stopEvent()),
  sound_channels:   Joi.array().items(Bmson.soundChannel()).required(),
  bga:              Bmson.bga(),
})

Bmson.info = () => Joi.object({
  title:            Joi.string().required(),
  subtitle:         Joi.string(),
  artist:           Joi.string().required(),
  subartists:       Joi.array().items(Joi.string()),
  genre:            Joi.string().required(),
  mode_hint:        Joi.string().default('beat-7k'),
  chart_name:       Joi.string(),
  level:            Joi.number().integer().min(0),
  init_bpm:         Joi.number().positive().required(),
  judge_rank:       Joi.number().min(0).default(100),
  total:            Joi.number().min(0).default(100),
  back_image:       Joi.string(),
  eyecatch_image:   Joi.string(),
  banner_image:     Joi.string(),
  preview_music:    Joi.string(),
  resolution:       Joi.number().positive().integer(),
})

Bmson.barLine = () => Joi.object({
  y:                Bmson.pulseNumber(),
})

Bmson.soundChannel = () => Joi.object({
  name:             Joi.string(),
  notes:            Joi.array().items(Bmson.note()),
})

Bmson.note = () => Joi.object({
  x:                Joi.any(),
  y:                Bmson.pulseNumber(),
  l:                Bmson.pulseCount(),
  c:                Joi.boolean(),
})

Bmson.bpmEvent = () => Joi.object({
  y:                Bmson.pulseNumber(),
  bpm:              Joi.number(),
})

Bmson.stopEvent = () => Joi.object({
  y:                Bmson.pulseNumber(),
  duration:         Bmson.pulseCount(),
})

Bmson.bga = () => Joi.object({
  bga_header:       Joi.array().items(Bmson.bgaHeader()),
  bga_events:       Joi.array().items(Bmson.bgaEvent()),
  layer_events:     Joi.array().items(Bmson.bgaEvent()),
  poor_events:      Joi.array().items(Bmson.bgaEvent()),
})

Bmson.bgaHeader = () => Joi.object({
  id:               Joi.number().integer().min(0),
})

Bmson.bgaEvent = () => Joi.object({
  y:                Bmson.pulseNumber(),
  id:               Joi.number().integer().min(0),
})

Bmson.pulseNumber = () => Joi.number().integer().min(0)

Bmson.pulseCount  = () => Joi.number().integer().min(0)

module.exports = Bmson.topLevel()
