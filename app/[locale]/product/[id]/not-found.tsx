import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Package Not Found</h2>
      <p className="text-gray-600 mb-8">
        The package you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Browse All Packages
      </Link>
    </div>
  );
}