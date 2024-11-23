"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Twitter, Facebook, Linkedin, LinkIcon } from 'lucide-react'

export function ShareButton({ campaignId }: { campaignId: string }) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/campaign/${campaignId}`

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out this fundraising campaign!`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=Check out this fundraising campaign!`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // You might want to add some visual feedback here
        return;
    }
    window.open(shareUrl, '_blank');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this campaign</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            readOnly
            value={url}
          />
          <Button size="sm" className="px-3" onClick={() => handleShare('copy')}>
            <span className="sr-only">Copy</span>
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-around pt-4">
          <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

