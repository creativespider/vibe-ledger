export const metadata = { title: "Vibe Starter" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
        {children}
      </body>
    </html>
  );
}
