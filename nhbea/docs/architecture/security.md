# Security
Authentication: No user authentication is required for the MVP.

Authorization: Content management will be handled outside the app via the FireCMS portal, which connects to Firebase with admin credentials.

Data Security: All data in Firestore will be protected by firestore.rules. The rules will be configured to allow public reads for most content while restricting writes to authenticated admin users (or server-side functions).

Payment Security: All payments are handled by Square's secure, hosted checkout pages. The application does not handle or store any credit card information, drastically reducing PCI compliance scope.