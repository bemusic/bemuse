import { showAlert, showQuickPick } from 'bemuse/ui-dialogs'

export function main() {
  ;(async () => {
    const result = await showQuickPick(
      ['one', 'two', 'three'].map((x) => ({ label: x })),
      { title: 'test' }
    )
    await showAlert('Result', 'You selected: ' + result.label)
  })()
}
