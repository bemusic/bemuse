import createConnectIO from '../../impure-react/createConnectIO'
import { withProps } from 'recompose'
import runIO from './runIO'

export const connectIO = createConnectIO(withProps({ runIO }))
export default connectIO
