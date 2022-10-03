import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
      <Link href="/sql-editor" className={styles.card}>
        <a>
          <h1>SQL EDITOR &rarr;</h1>
          <p>Make sql queries here</p>
        </a>
      </Link>
      </main>
    </div>
  )
}
