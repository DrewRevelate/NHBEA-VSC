export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">NHBEA Connect</div>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:text-gray-600">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-600">About</a>
            </li>
            <li>
              <a href="/conference" className="hover:text-gray-600">Conference</a>
            </li>
            <li>
              <a href="/membership" className="hover:text-gray-600">Membership</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}