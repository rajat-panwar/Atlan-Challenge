import styles from './CircularProgress.module.css'

function CircularProgress (props) {
  return (
    props.show ? <span 
    className={styles[`loaderStyle${props.size}` || 'loaderStyleMedium']} 
    /> : <span />
  )
}

export default CircularProgress
