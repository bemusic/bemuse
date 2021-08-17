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
  t: number
  x: number
  /** the amount of change in x per t */
  dx: number
  /** whether or not the segment includes the t */
  inclusive: boolean
}
