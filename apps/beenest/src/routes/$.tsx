import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { Home } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative w-48 h-48 mx-auto">
          <img
            src="https://readdy.ai/api/search-image?query=cute%20friendly%20bee%20character%20looking%20confused%20and%20lost%20on%20clean%20white%20background%20minimal%20illustration%20style%20professional%20mascot%20design&width=200&height=200&seq=404-bee&orientation=squarish"
            alt="404 Bee"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600">
          Oops! Looks like this page has buzzed away.
        </p>
        <p className="text-gray-500">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link to="/dashboard">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg whitespace-nowrap">
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})