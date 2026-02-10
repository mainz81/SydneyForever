export const metadata = {
  title: "Sydney Forever",
  description: "A luxury romantic muse experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        background: "radial-gradient(circle at top, #1a1a1f, #050507)",
        color: "#f5f5f7",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        {children}
      </body>
    </html>
  );
}
