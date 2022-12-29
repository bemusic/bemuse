import styled from '@emotion/styled'

const DialogContent = styled('div')({
  padding: '1em',
  '> p': {
    margin: 0,
    '&:not(:first-child)': {
      marginTop: '1em',
    },
  },
})

export const Buttons = styled('p')({
  textAlign: 'right',
})

export default DialogContent
