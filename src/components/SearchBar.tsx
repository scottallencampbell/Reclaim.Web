import { useState } from 'react'
import Icon from './Icon'

interface ISearchBar {
  onChange: any
}

const SearchBar = ({ onChange }: ISearchBar) => {
  const [terms, setTerms] = useState('')

  const handleChange = (e: any) => {
    setTerms(e.target.value)

    if (typeof onChange === 'function') {
      onChange(e.target.value)
    }
  }

  return (
    <div className="search-bar">
      <div className="search-bar-buttons">
        <Icon name="Search" className="left"></Icon>
      </div>
      <input type="text" value={terms} onChange={handleChange}></input>
    </div>
  )
}

export default SearchBar
