import dynamic from "next/dynamic"
import { Suspense, useRef, useState } from "react"
import ResultSection from '../result'
import SuggestionList from '../suggestion-list'
import styles from './SqlEditor.module.css'
import { AVAILABLE_TABLE_NAMES } from "../../store/constants"
import { srFetchQuery } from '../../sources/sql-query'

const DynamicEditor = dynamic(() => import('../editor'), {
    suspense: true
})

export default function SqlEditor () {
    const [query, setQuery] = useState({ 0: 'Write your query here ...'})
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState({0: "Result will be shown here after you run your query ..." })
    const [activeEditorIndex,  setActiveEditorIndex] = useState(0)
    const dragResizer = useRef({
        x: 0,
        y: 0,
        leftWidth: 0,
        topHeight: 0,
        isLeftDragg: false
    })

    const runQuery = async (query) => {
        const supportedQuery = /SELECT \* FROM ([a-z_]*)/
        const tableName = supportedQuery.exec(query)?.['1']
        if(!supportedQuery.test(query)) {
            setResult({ ...result, [activeEditorIndex]: "Facing difficulty ? Use query from the suggestion list."})
            return;
        }
        setIsLoading(true)
        try {
            const data = await srFetchQuery(tableName)
            setResult({...result, [activeEditorIndex]: data})
        } catch (error) {
            console.log(error, 'error while fetching data')
            setResult({ ...result, [activeEditorIndex]: "Unable to fetch query, Please try again after sometime."})
        }
        setIsLoading(false)
    }

    const deleteCurrentTab = (tabIndex) => {
        delete result[tabIndex]
        delete query[tabIndex]
        setResult({...result})
        setQuery({...query})
    }


    // Below code is for drag resizer split view
    
    const mouseDownHandler = function (e) {
        // Get the current mouse position

        const resizer = document.getElementById('dragMe');
        const leftSide = resizer.previousElementSibling;
        dragResizer.current.x = e.clientX;
        dragResizer.current.y = e.clientY;
        dragResizer.current.leftWidth = leftSide.getBoundingClientRect().width;
        dragResizer.current.topHeight = leftSide.getBoundingClientRect().height;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        dragResizer.current.isLeftDragg = true;
    };
    const mouseMoveHandler = function (e) {
        if(!dragResizer.current.isLeftDragg) {
            return;
        }
        // How far the mouse has been moved
        const resizer = document.getElementById('dragMe');
        const leftSide = resizer.previousElementSibling;
        const rightSide = resizer.nextElementSibling;
        const dx = e.clientX - dragResizer.current.x;
        const dy = e.clientY - dragResizer.current.y;

        const h = (dragResizer.current.topHeight + dy) * 100 / resizer.parentNode.getBoundingClientRect().height;
        if(h < 30 || h > 80) {return ;}
        leftSide.style.height = `${h}%`;
        rightSide.style.height= `${100-h}%`;
        resizer.style.top = `${leftSide.getBoundingClientRect().height + 10}px`;

        if(document) {
            document.body.style.cursor = 'row-resize';
        }

        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };
    const mouseUpHandler = function () {
        dragResizer.current.isLeftDragg = false;
        const resizer = document.getElementById('dragMe');
        const leftSide = resizer.previousElementSibling;
        const rightSide = resizer.nextElementSibling;
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    const resize = () => {
        const resizer = document.getElementById('dragMe');
        const leftSide = resizer.previousElementSibling;
        resizer.style.top = `${leftSide.getBoundingClientRect().height + 15}px`;
    }

    return (
        <div className={styles.container}>
            <div className={styles.col1} >
                <Suspense fallback={`Loading ....`}>
                    <DynamicEditor
                        query={query}
                        setQuery={setQuery}
                        runQuery={runQuery}
                        activeEditorIndex={activeEditorIndex}
                        setActiveEditorIndex={setActiveEditorIndex}
                        deleteCurrentTab={deleteCurrentTab}
                        result={result}
                        setResult={setResult}
                        isLoading={isLoading}
                    />
                </Suspense>
                <div
                    className={styles.resizer}
                    id="dragMe"
                    onMouseDown={mouseDownHandler}
                    onMouseMove={mouseMoveHandler}
                    onMouseUp={mouseUpHandler}
                    onResize={resize}
                />
                <ResultSection
                    result={result[activeEditorIndex]} 
                    activeEditorIndex={activeEditorIndex} 
                    isLoading={isLoading}
                />
            </div>
            <div className={styles.col2}>
                <SuggestionList 
                    suggestionList={AVAILABLE_TABLE_NAMES} 
                    setQuery={setQuery} 
                    query={query} 
                    activeEditorIndex={activeEditorIndex}
                />
            </div>
        </div>
    )
}