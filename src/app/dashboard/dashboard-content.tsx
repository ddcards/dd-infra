'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamCreationModal } from '@/components/team-creation-modal'
import { getTeams } from '@/app/actions/create-team'
import { useEffect } from 'react'

interface DashboardContentProps {
  user: {
    email?: string
  }
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    const result = await getTeams()
    if (result.success) {
      setTeams(result.teams || [])
    }
    setLoading(false)
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    loadTeams()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your teams and trading card orders</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
              <CardDescription>Start a new trading card project for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => setIsModalOpen(true)}>
                Create Team
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Teams</CardTitle>
              <CardDescription>View and manage your existing teams</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : teams.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No teams yet. Create your first team to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div key={team.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{team.teamName}</div>
                        <div className="text-xs text-muted-foreground">{team.sport}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        team.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {team.paymentStatus}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Email:</span> {user.email || 'N/A'}
                </div>
                <form action="/auth/signout" method="post">
                  <Button variant="outline" size="sm" type="submit">
                    Sign Out
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TeamCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
