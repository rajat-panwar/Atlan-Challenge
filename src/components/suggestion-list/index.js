import { useState, useEffect, memo } from 'react'
import style from './SuggestionList.module.css'

function SuggestionList ({suggestionList = [], setQuery, query, activeEditorIndex }) {
    const [searchInput, setSearchInput] =  useState('')
    const [list, setList] = useState(suggestionList)

    useEffect(() => {
      setList(suggestionList.filter(item => item.startsWith(searchInput)))
    }, [searchInput])

    const onClickHandler = (tableName) => {
        setQuery({...query, [activeEditorIndex]: `SELECT * FROM ${tableName}` })
    }
    
    return (
        <div className={style.container}>
            <div className={style.header}>Suggestion List</div>
            <div className={style.searchInputWrapper}>
                <input
                    type={'text'}
                    placeholder={'Search ...'}
                    className={style.searchBar}
                    onChange={e => setSearchInput(e.target.value)}
                />
            </div>
            <ul className={style.listContainer}>
                {list.length > 0 && list.map((table) => {
                    return (
                        <li
                            id={table} 
                            key={table} 
                            className={style.listElement} 
                            onClick={onClickHandler.bind({}, table)}
                        >
                            {table}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default memo(SuggestionList)