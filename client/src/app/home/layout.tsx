import Navbar from "../components/layout/navbar.component";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-24">
        <Navbar />
          {children}
    </div>
  );
}