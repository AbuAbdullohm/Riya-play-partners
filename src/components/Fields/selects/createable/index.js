import React, { useState } from 'react'
import data from './data.js'
import { ReactComponent as CloseIcon } from './icons/i-close.svg'
import { ReactComponent as ChevronDown } from './icons/chevron-down-outline.svg'
// import {ReactComponent as ChevronUp} from './icons/chevron-up-outline.svg'
import './style.scss'



const CreateableSelectComponent = ({ options, optionLabel, optionValue }) => {
  const [isToggle, setToggle] = useState(false)
  const [option, setOption] = useState({})
  const [text, setText] = useState('')

  const handleClickItem = (item) => {
    setOption(item)
    setToggle(false)
    setText(item.name)
  }

  return (
    <div className="select-container">
      <div className="select-input select-input-middle">
        <input type="text" className="select-input__text" onClick={() => setToggle(!isToggle)} value={text} onChange={(e) => setText(e.target.value)} />
        <span className="select-input__dropdown"><CloseIcon /></span>
        <span className="select-input__icon"><ChevronDown /></span>
      </div>
      <ul className={`select-options select-options-middle d-${isToggle ? 'block' : 'none'}`}>
        {data.map((item, i) => {
          return (
            <li key={item.id} className="select-options__item" onClick={() => handleClickItem(item)}>{i + 1}. {item.name}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default CreateableSelectComponent
