import './ComboBox.scss'
import React, { useState } from 'react'
import { useCombobox } from 'downshift'
import fuzzysort from 'fuzzysort'

export type ComboBoxItem = {
  label: string
}

export function ComboBox<T extends ComboBoxItem>(props: {
  items: T[]
  onSelect: (item: T) => void
}) {
  const [inputItems, setInputItems] = useState(props.items)
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setHighlightedIndex,
  } = useCombobox({
    items: inputItems,
    initialHighlightedIndex: 0,
    isOpen: true,
    onInputValueChange: ({ inputValue }) => {
      const results = inputValue
        ? fuzzysort
            .go(inputValue, props.items, { key: 'label' })
            .map((r) => r.obj)
        : props.items
      setInputItems(results)
    },
    onHighlightedIndexChange: ({ highlightedIndex }) => {
      if (highlightedIndex === -1 && inputItems.length > 0) {
        setHighlightedIndex(0)
      }
    },
    onSelectedItemChange: ({ selectedItem, type }) => {
      if (
        selectedItem &&
        (type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
          type === useCombobox.stateChangeTypes.ItemClick)
      ) {
        props.onSelect(selectedItem)
      }
    },
    itemToString: (item) => item?.label || '',
  })

  return (
    <div className='ComboBox'>
      <label hidden {...getLabelProps()}>
        Choose an element:
      </label>
      <div {...getComboboxProps()} className='ComboBoxのsearch'>
        <input {...getInputProps()} className='ComboBoxのinput' />
      </div>
      <ul {...getMenuProps()} className='ComboBoxのmenu'>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              data-highlighted={highlightedIndex === index}
              key={`${item.label}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  )
}
