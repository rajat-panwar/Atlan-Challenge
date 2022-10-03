import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useState, useEffect, useRef, memo } from "react";
import style from './Editor.module.css'

function Editor (props) {
    const { query = {}, setQuery, runQuery, activeEditorIndex = 0, setActiveEditorIndex, deleteCurrentTab, result, setResult, isLoading } = props
    const [text, setText] = useState(query[activeEditorIndex])
    const [tabs, setTabs] = useState({0 : 'SQL-1'})
    const totalTabsTillNow = useRef(1)

    useEffect(() => {
        setText(query[activeEditorIndex])
    }, [query])

    useEffect(() => {
        setText(query[activeEditorIndex])
    }, [activeEditorIndex])
    
    useEffect(() => {
        const newActiveIndex = getIndexOfLastElementFromTabs()
        setActiveEditorIndex(newActiveIndex)
    }, [tabs])

    const getIndexOfLastElementFromTabs = () => Number(Object.keys(tabs).sort().slice(-1))

    const clearText = () => {
        query[activeEditorIndex] = ""
        setQuery({...query})
    }

    const fetchData = () => {
        runQuery(text)
        query[activeEditorIndex] = text
        setQuery({...query})
    }

    const addTab = () => {
        const nextTab = totalTabsTillNow.current;
        totalTabsTillNow.current+=1;
        setActiveEditorIndex(nextTab)
        setTabs({...tabs, [nextTab]: `SQL-${nextTab+1}`})
        setQuery({...query, [nextTab]: 'Write your query here ...'})
        setResult({...result, [nextTab]: "Result will be shown here after you run your query ..."})     
    }

    const deleteTab = (tabIndex) => {
        delete tabs[tabIndex]
        setTabs({...tabs})
        deleteCurrentTab(tabIndex)

    }
    return (
        <div className={style.editor} >
            <div className={style.multipleTabs}>
                {Object.keys(tabs).length > 0 && Object.keys(tabs).map((tabIndex) => {
                    const showTabClose = Object.keys(tabs).length !=  1
                    const showStyleWithBar = tabIndex > activeEditorIndex || Math.abs(tabIndex-activeEditorIndex) > 1
                    const styleTab = `${style.tab} ${tabIndex == activeEditorIndex ? style.activeTab : showStyleWithBar ? style.notActiveTabColumn : style.notActiveTab}`

                    return (
                        <div
                            key={tabs[tabIndex]}
                            onClick={() => setActiveEditorIndex(Number(tabIndex))}
                            className={styleTab}
                        >
                            <span>{tabs[tabIndex]}</span>
                            {showTabClose && <div className={style.cross} onClick={() => deleteTab(tabIndex)}/>}
                        </div>
                    )
                })}
                <div className={style.addTab} onClick={addTab}>
                    <span>+</span>
                </div>
            </div>
            <div className={style.editorWrapper}>
                <CodeMirror
                    value={text}
                    extensions={[sql()]}
                    onChange={(value, viewUpdate) => {
                        setText(value);
                    }}
                    className={style['cm-theme-light']}
                />
                <div className={style.buttonWrapper}>
                    <button
                        className={style.clearButton}
                        onClick={clearText}
                    >Clear</button>
                    <button
                        className={style.runButton}
                        onClick={fetchData}
                        disabled={isLoading}
                    >Run</button>
                </div>
            </div>
        </div>
    )
}

export default memo(Editor)