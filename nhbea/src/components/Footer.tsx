export default function Footer() {
  return (
    <footer className="w-full border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">About NHBEA</h3>
            <p className="text-sm text-gray-600">
              New Hampshire Business Education Association - Supporting business educators across the state.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/awards" className="text-gray-600 hover:text-gray-900">Awards</a></li>
              <li><a href="/hall-of-fame" className="text-gray-600 hover:text-gray-900">Hall of Fame</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <p className="text-sm text-gray-600">
              Stay updated with our newsletter and latest news.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} New Hampshire Business Education Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}