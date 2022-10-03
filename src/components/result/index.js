import style from './Result.module.css'
import { memo, useCallback, useRef } from 'react'
import CircularProgress from '../commons/circular-loader'
import { useVirtual } from 'react-virtual'

const Result = ({ result = [], isLoading = false}) => (
    <div className={style.container}>
        <div>Output</div>
        <ResultTable result={result} isLoading={isLoading} />
    </div>
)

const ResultTable = ({result = [], isLoading}) => { 
    const parentRef= useRef()
    const rowVirtualizer = useVirtual({
        size: result.length-1,
        parentRef,
        estimateSize: useCallback(() => 100, [])
    })
    if(isLoading) {
        return (
            <div className={style.noResult}>
                <CircularProgress show size={'Medium'} />
            </div>
        )
    } else if(result.length > 0 && Array.isArray(result)) {
        const rowElements = [...result]
        const header = rowElements.shift()
        return (
            <div className={style.result}>
                <table className={style.table} role="table" ref={parentRef} style={{ height: '100vh', width: '100%', overflow: 'auto'}}>
                    <thead>
                        <tr role="row">
                            {Object.keys(header).map((headerName) => <th key={`header-${headerName}`} className={style.headerElement}>{header[headerName]}</th>)}
                        </tr>
                    </thead>
                    <tbody role="rowgroup" style={{ height: `${rowVirtualizer.totalSize}px`, position: 'relative', width: '100%'}}>
                        {
                            rowVirtualizer.virtualItems.map(virtualRow => {
                                return(
                                <tr role="row" key={virtualRow.index} style={{ position: 'absolute', top: '0', left: '0', width: '100%', transform: `translateY(${virtualRow.start}px)`}}>
                                        {Object.keys(rowElements[virtualRow.index]).map((cell) => <td key={`cell-${cell}`} className={style.cellElement}>{rowElements[virtualRow.index][cell]}</td>)}
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    } else {
        return (
            <div className={style.noResult}>
                {result}
            </div>
        )
    }
}

export default memo(Result)