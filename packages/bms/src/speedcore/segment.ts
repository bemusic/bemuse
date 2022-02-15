import DataStructure from 'data-structure'

/**
 * @internal
 */
export const Segment = DataStructure<SpeedSegment>({
  t: 'number',
  x: 'number',
  dx: 'number',
})

/**
 * @public
 */
export interface SpeedSegment {
  /** The time `t` */
  t: number
  /** The value `x` */
  x: number
  /** The amount of change of value `x` per `t` */
  dx: number
  /** Whether or not the segment includes the time `t` */
  inclusive: boolean
}
