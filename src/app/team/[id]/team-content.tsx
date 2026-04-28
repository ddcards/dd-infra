'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface TeamContentProps {
  team: any
  players: any[]
}

export default function TeamContent({ team, players }: TeamContentProps) {
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [playerData, setPlayerData] = useState({ name: '', jerseyNumber: '', position: '' })
  const [showProofs, setShowProofs] = useState(false)

  if (team.paymentStatus !== 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Payment Required</CardTitle>
            <CardDescription>
              This team has not been paid for yet. Please complete your payment to access the roster editor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player.id)
    setPlayerData({
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      position: player.position,
    })
  }

  const handleSavePlayer = async () => {
    const { updatePlayer } = await import('@/app/actions/upload-photo')
    const result = await updatePlayer(editingPlayer!, playerData)
    if (result.success) {
      setEditingPlayer(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingPlayer(null)
    setPlayerData({ name: '', jerseyNumber: '', position: '' })
  }

  const handleApproveOrder = async () => {
    // Generate print images for all players
    const { generatePrintImage } = await import('@/app/actions/generate-proof')
    
    for (const player of players) {
      if (player.cleanImageUrl) {
        await generatePrintImage(player.id, player.cleanImageUrl, player.name, player.jerseyNumber)
      }
    }

    // Trigger print fulfillment with MPC
    const { submitToMPC } = await import('@/app/actions/mpc-fulfillment')
    const result = await submitToMPC(team.id, players)
    
    if (result.success) {
      setShowProofs(false)
      alert('Order approved and submitted to printer! You will receive a confirmation email.')
    } else {
      alert('Error submitting order: ' + result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{team.teamName}</h1>
            <p className="text-gray-600 mt-2">{team.sport} • {players.length} players</p>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Roster Editor</h2>
            <p className="text-gray-600">Edit player details and upload photos</p>
          </div>
          {players.some(p => p.status === 'proof_ready') && (
            <Button onClick={() => setShowProofs(true)} size="lg">
              Review Proofs
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Card key={player.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingPlayer === player.id ? (
                    <Input
                      value={playerData.name}
                      onChange={(e) => setPlayerData({ ...playerData, name: e.target.value })}
                      placeholder="Player Name"
                    />
                  ) : (
                    player.name
                  )}
                </CardTitle>
                <CardDescription>
                  {editingPlayer === player.id ? (
                    <div className="space-y-2">
                      <Input
                        value={playerData.jerseyNumber}
                        onChange={(e) => setPlayerData({ ...playerData, jerseyNumber: e.target.value })}
                        placeholder="Jersey Number"
                      />
                      <Input
                        value={playerData.position}
                        onChange={(e) => setPlayerData({ ...playerData, position: e.target.value })}
                        placeholder="Position"
                      />
                    </div>
                  ) : (
                    `#${player.jerseyNumber} • ${player.position}`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`text-xs px-2 py-1 rounded inline-block ${
                    player.status === 'empty' ? 'bg-gray-100 text-gray-800' :
                    player.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                    player.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    player.status === 'proof_ready' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {player.status}
                  </div>

                  {editingPlayer === player.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSavePlayer} className="flex-1">
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPlayer(player)} className="flex-1">
                        Edit Details
                      </Button>
                      <Button size="sm" disabled={player.status !== 'empty'} className="flex-1">
                        Upload Photo
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showProofs && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Review Proofs</CardTitle>
                <CardDescription>
                  Review all trading card proofs before approving for print
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  {players.filter(p => p.proofImageUrl).map((player) => (
                    <div key={player.id} className="border rounded-lg p-3">
                      <img
                        src={player.proofImageUrl}
                        alt={`${player.name} proof`}
                        className="w-full rounded mb-2"
                      />
                      <div className="text-sm font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">#{player.jerseyNumber}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowProofs(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApproveOrder}
                    disabled={!players.every(p => p.status === 'proof_ready')}
                    className="flex-1"
                  >
                    Approve Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
