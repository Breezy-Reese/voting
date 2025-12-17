export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', borderTop: '1px solid #ccc' }}>
      <p>&copy; {new Date().getFullYear()} Online Voting System. All rights reserved.</p>
    </footer>
  );
}
