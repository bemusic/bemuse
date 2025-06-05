import Link from 'next/link';
import styles from './page.module.css'; // Assuming you might want to add specific styles later

export default function HomePage() {
  return (
    <main className={styles.mainContent || ''} style={{ padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Welcome to Bemuse</h1>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          The web-based rhythm game of the future. Explore our documentation, learn how to play, or contribute to the project.
        </p>
      </header>

      <nav style={{ textAlign: 'center' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ display: 'inline-block', marginRight: '20px' }}>
            <Link href="/docs/user-guide" style={{ fontSize: '1.1em' }}>User Guide</Link>
          </li>
          <li style={{ display: 'inline-block', marginRight: '20px' }}>
            <Link href="/docs/developer-guide" style={{ fontSize: '1.1em' }}>Developer Guide</Link>
          </li>
          <li style={{ display: 'inline-block' }}>
            <Link href="/docs/faq" style={{ fontSize: '1.1em' }}>FAQ</Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </main>
  );
}
