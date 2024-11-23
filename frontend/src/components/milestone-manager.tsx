import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from 'lucide-react'
import { Milestone } from '@/types/campaign'

interface MilestoneManagerProps {
  milestones: Milestone[]
  onChange: (milestones: Milestone[]) => void
}

export function MilestoneManager({ milestones, onChange }: MilestoneManagerProps) {
  const [newMilestone, setNewMilestone] = useState<Milestone>({ description: '', target: 0 })

  const addMilestone = () => {
      onChange([...milestones, newMilestone])
      setNewMilestone({ description: '', target: 0 })
  }

  const removeMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index)
    onChange(updatedMilestones)
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    const updatedMilestones = milestones.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    )
    onChange(updatedMilestones)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Milestones</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMilestone}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Milestone
        </Button>
      </div>
      {milestones.length === 0 && (
        <p className="text-sm text-gray-500">No milestones added yet. Add your first milestone below.</p>
      )}
      {milestones.map((milestone, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={milestone.description}
            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
            placeholder="Milestone description"
            className="flex-grow"
          />
          <Input
            type="number"
            value={milestone.target}
            onChange={(e) => updateMilestone(index, 'target', parseFloat(e.target.value))}
            placeholder="Target (SOL)"
            className="w-24"
          />
          <Button variant="ghost" onClick={() => removeMilestone(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

