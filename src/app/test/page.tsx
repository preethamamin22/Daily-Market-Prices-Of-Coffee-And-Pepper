export default function TestPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Test Page</h1>
            <p>If you can see this, Next.js is working!</p>
            <p>Environment variables:</p>
            <ul>
                <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'NOT SET'}</li>
                <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET'}</li>
                <li>DATABASE_URL: {process.env.DATABASE_URL ? 'SET' : 'NOT SET'}</li>
            </ul>
        </div>
    );
}
