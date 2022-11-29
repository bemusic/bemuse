import styled from '@emotion/styled'

const DialogContent = styled.div`
  padding: 1em;
  > p {
    margin: 0;
    &:not(:first-child) {
      margin-top: 1em;
    }
  }
`

export const Buttons = styled.p`
  text-align: right;
`

export default DialogContent
