'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TeamCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TeamCreationModal({ isOpen, onClose, onSuccess }: TeamCreationModalProps) {
  const [step, setStep] = useState(1)
  const [teamName, setTeamName] = useState('')
  const [sport, setSport] = useState('')
  const [rosterSize, setRosterSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('teamName', teamName)
      formData.append('sport', sport)
      formData.append('rosterSize', rosterSize)

      const response = await fetch('/api/create-team', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team')
      }

      setStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          sport,
          rosterSize: parseInt(rosterSize),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pricePerPlayer = 25
  const totalPrice = parseInt(rosterSize) * pricePerPlayer

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 1 ? 'Create New Team' : 'Complete Your Order'}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? 'Enter your team details to get started'
              : 'Review and pay for your trading card order'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="teamName" className="text-sm font-medium">
                  Team Name
                </label>
                <Input
                  id="teamName"
                  placeholder="e.g., Springfield Tigers"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sport" className="text-sm font-medium">
                  Sport
                </label>
                <Input
                  id="sport"
                  placeholder="e.g., Baseball, Basketball"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rosterSize" className="text-sm font-medium">
                  Roster Size
                </label>
                <Input
                  id="rosterSize"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g., 15"
                  value={rosterSize}
                  onChange={(e) => setRosterSize(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Continue'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Team:</span>
                  <span className="font-medium">{teamName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sport:</span>
                  <span className="font-medium">{sport}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Players:</span>
                  <span className="font-medium">{rosterSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price per player:</span>
                  <span className="font-medium">${pricePerPlayer}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Processing...' : `Pay $${totalPrice}`}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
