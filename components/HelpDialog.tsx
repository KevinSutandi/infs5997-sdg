import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle, Trophy, Gift, Compass, Users, TrendingUp } from 'lucide-react';

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
          aria-label="Help"
        >
          <HelpCircle className="h-6 w-6" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Platform Guide</DialogTitle>
          <DialogDescription>
            Learn how to make the most of SDGgo! and track your sustainable impact
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="earning-points">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                <span>How to Earn SDG Points</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">
                You can earn SDG points through three main activities:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>📚 Coursework (500-600 points)</strong></p>
                  <p className="text-sm text-muted-foreground">
                    Complete SDG-related courses offered by various departments. These courses run throughout the semester.
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>👥 Society Activities (400-800 points)</strong></p>
                  <p className="text-sm text-muted-foreground">
                    Join student societies focused on sustainability and participate in their ongoing initiatives.
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>📅 Events (200-300 points)</strong></p>
                  <p className="text-sm text-muted-foreground">
                    Attend workshops, seminars, and one-time events related to the UN Sustainable Development Goals.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Tip: Mix different activity types to maximize your impact across all 17 SDG goals!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="redeeming-rewards">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <span>Redeeming Rewards</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">
                Exchange your earned points for exclusive rewards:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Navigate to the <strong>Redeem Store</strong> tab</li>
                <li>Browse rewards by category (Discount, Food & Beverage, Merchandise, Experiences)</li>
                <li>Check the required points and stock availability</li>
                <li>Click <strong>&quot;Redeem Now&quot;</strong> on your chosen reward</li>
                <li>Review the confirmation details and expiry date</li>
                <li>Confirm your redemption (non-refundable)</li>
                <li>Find your voucher in <strong>My Rewards</strong> under the Active tab</li>
              </ol>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <strong>⚠️ Important:</strong> All redemptions are non-refundable. Make sure to check expiry dates and stock availability before redeeming!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="navigation">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <span>Navigating the Platform</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">
                The platform has five main sections:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>📢 Activities</strong></p>
                  <p className="text-sm text-muted-foreground">
                    Browse and register for available SDG activities. Use filters to find coursework, society activities, or events by SDG goal or category.
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>🏆 Rankings</strong></p>
                  <p className="text-sm text-muted-foreground">
                    View leaderboards filtered by Uni, Faculty, or Friends. Track weekly, monthly, or all-time performance. Follow other students to stay connected.
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>📊 My Dashboard</strong></p>
                  <p className="text-sm text-muted-foreground">
                    See your total points, recent activities, SDG impact breakdown, and your followed friends.
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>🎁 My Rewards</strong></p>
                  <p className="text-sm text-muted-foreground">
                    View earned badges, active vouchers, used vouchers, and expiring vouchers. Share your achievements!
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="mb-1"><strong>🛍️ Redeem Store</strong></p>
                  <p className="text-sm text-muted-foreground">
                    Browse and redeem rewards using your points. Filter by category and check stock levels.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="following">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Following Friends</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">
                Stay connected with peers and track their progress:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Go to the <strong>Rankings</strong> tab</li>
                <li>Use the search bar to find students by ID or name</li>
                <li>Click the <strong>+ Follow button</strong> next to any user</li>
                <li>View your followed friends in <strong>My Dashboard</strong></li>
                <li>Click &quot;View All&quot; to see your complete friends list</li>
                <li>Use the Friends filter on Rankings to see only followed users</li>
              </ol>
              <p className="text-sm text-muted-foreground italic">
                Note: Following is one-way and doesn&apos;t require approval. You can unfollow at any time.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="badges">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Earning Badges</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">
                Unlock special badges by completing specific milestones:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Climate Champion:</strong> Complete 5 climate-related activities</li>
                <li><strong>First Steps:</strong> Register for your first SDG activity</li>
                <li><strong>Point Collector:</strong> Earn 2000+ SDG points</li>
                <li><strong>Top 10:</strong> Reach the top 10 on the leaderboard</li>
                <li><strong>Diversity Advocate:</strong> Participate in activities across all 17 SDGs</li>
                <li><strong>Social Leader:</strong> Join 3+ student societies</li>
                <li><strong>Event Enthusiast:</strong> Attend 10 SDG events</li>
                <li><strong>Academic Excellence:</strong> Complete 5 SDG coursework modules</li>
              </ul>
              <p className="text-sm text-muted-foreground italic">
                Share your earned badges from My Rewards to showcase your achievements!
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-center text-muted-foreground">
            Need more help? Contact the Student Union or visit the SDGgo! help desk during office hours.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
