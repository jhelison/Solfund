"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Contribution {
  id: string
  campaignId: string
  campaignName: string
  amount: number
  date: Date
  status: "open" | "successful" | "expired"
}

export default function MyContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([])

  useEffect(() => {
    // Fetch user contributions
    // This is a mock fetch, replace with actual API call
    const fetchContributions = async () => {
      // Simulating API call
      const response = await new Promise<Contribution[]>((resolve) =>
        setTimeout(() => resolve([
          { id: "1", campaignId: "c1", campaignName: "Save the Oceans", amount: 5, date: new Date(2023, 5, 1), status: "open" },
          { id: "2", campaignId: "c2", campaignName: "Build a School", amount: 10, date: new Date(2023, 4, 15), status: "successful" },
          { id: "3", campaignId: "c3", campaignName: "Plant Trees", amount: 3, date: new Date(2023, 3, 1), status: "expired" },
        ]), 500)
      )
      setContributions(response)
    }
    fetchContributions()
  }, [])

  const handleRemoveContribution = (contributionId: string) => {
    // Here you would implement the logic to remove the contribution
    // For now, we'll just remove it from the local state
    setContributions(contributions.filter(c => c.id !== contributionId))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Contributions</h1>
      {contributions.length === 0 ? (
        <p>You haven't made any contributions yet.</p>
      ) : (
        contributions.map((contribution) => (
          <Card key={contribution.id}>
            <CardHeader>
              <CardTitle>{contribution.campaignName}</CardTitle>
              <CardDescription>Contributed on {contribution.date.toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Amount: {contribution.amount} SOL</p>
              <p>Status: {contribution.status}</p>
            </CardContent>
            <CardFooter>
              {(contribution.status === "open" || contribution.status === "expired") && (
                <Button onClick={() => handleRemoveContribution(contribution.id)}>
                  Remove Contribution
                </Button>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

