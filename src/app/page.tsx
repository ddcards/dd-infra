import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Diamond Deck Co.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create custom trading cards for your sports team. Professional quality, easy ordering.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Create Team</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enter your team details and roster size to get started
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload player photos and we'll remove backgrounds automatically
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Review proofs and approve for professional printing
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
