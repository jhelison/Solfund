import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockLeaderboard = [
  { rank: 1, wallet: "7X3cV...", amount: 20 },
  { rank: 2, wallet: "9Y4dW...", amount: 15 },
  { rank: 3, wallet: "3Z5eX...", amount: 10 },
  { rank: 4, wallet: "2A6fY...", amount: 8 },
  { rank: 5, wallet: "5B7gZ...", amount: 5 },
]

export function Leaderboard({ campaignId }: { campaignId: string }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Wallet</TableHead>
          <TableHead className="text-right">Amount (SOL)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockLeaderboard.map((entry) => (
          <TableRow key={entry.rank}>
            <TableCell className="font-medium">{entry.rank}</TableCell>
            <TableCell>{entry.wallet}</TableCell>
            <TableCell className="text-right">{entry.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

