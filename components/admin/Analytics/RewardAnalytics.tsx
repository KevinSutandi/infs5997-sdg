'use client';

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, Download } from 'lucide-react';
import { getRewardRedemptionAnalytics } from '@/lib/adminAnalytics';
import { rewardsCatalog } from '@/data/mockData';

export function RewardAnalytics() {
  const rewardsList = rewardsCatalog;
  // Calculate statistics
  const totalRewards = rewardsList.length;
  const merchandiseCount = rewardsList.filter(r => r.category === 'merchandise').length;
  const discountCount = rewardsList.filter(r => r.category === 'discount').length;
  const foodCount = rewardsList.filter(r => r.category === 'food').length;
  const experienceCount = rewardsList.filter(r => r.category === 'experience').length;

  // Get redemption analytics
  const redemptionStats = getRewardRedemptionAnalytics(rewardsList);
  const totalRedemptions = redemptionStats.reduce((sum, stat) => sum + stat.redemptions, 0);
  const totalPointsRedeemed = redemptionStats.reduce((sum, stat) => sum + stat.totalPointsRedeemed, 0);
  const avgRedemptionRate = redemptionStats.length > 0
    ? redemptionStats.reduce((sum, stat) => sum + stat.redemptionRate, 0) / redemptionStats.length
    : 0;

  const handleExport = () => {
    // Generate CSV with reward analytics data
    const csv = [
      ['Reward Title', 'Category', 'Points Required', 'Initial Stock', 'Current Stock', 'Redemptions', 'Redemption Rate (%)', 'Total Points Redeemed'],
      ...redemptionStats
        .sort((a, b) => b.redemptions - a.redemptions)
        .map(stat => [
          stat.title,
          stat.category,
          stat.pointsRequired,
          stat.initialStock,
          stat.currentStock,
          stat.redemptions,
          stat.redemptionRate.toFixed(1),
          stat.totalPointsRedeemed,
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reward-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reward Analytics</h1>
          <p className="text-muted-foreground">
            Analyze reward performance, redemption rates, and identify best-selling rewards
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Sales Performance Overview - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-500" />
          </div>
          <p className="text-2xl font-bold">{totalRedemptions}</p>
          <p className="text-sm text-muted-foreground">Total Redemptions</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold">{totalPointsRedeemed.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Points Redeemed</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{Math.round(avgRedemptionRate)}%</p>
          <p className="text-sm text-muted-foreground">Avg Redemption Rate</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">
            {redemptionStats.length > 0
              ? Math.round(
                (redemptionStats.filter(s => s.redemptions > 0).length / redemptionStats.length) * 100
              )
              : 0}%
          </p>
          <p className="text-sm text-muted-foreground">Active Rewards</p>
        </Card>
      </div>

      {/* Analytics Sub-tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Sales Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* Sales Performance Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Most Popular Rewards */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-500" />
              Most Popular Rewards (Best Sellers)
            </h3>
            <div className="space-y-3">
              {[...redemptionStats]
                .sort((a, b) => b.redemptions - a.redemptions)
                .slice(0, 10)
                .map((stat) => {
                  const reward = rewardsList.find(r => r.id === stat.rewardId);
                  if (!reward) return null;
                  return (
                    <div key={stat.rewardId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{stat.title}</p>
                          <Badge variant="secondary" className="text-xs capitalize shrink-0">{stat.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{stat.redemptions} redeemed</span>
                          <span>{stat.currentStock} remaining</span>
                          <span className="text-green-700 dark:text-green-500 font-medium">{stat.redemptionRate.toFixed(1)}% rate</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-sm">{stat.totalPointsRedeemed.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>

          {/* Least Popular Rewards */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              Least Popular Rewards (Need Attention)
            </h3>
            <div className="space-y-3">
              {[...redemptionStats]
                .sort((a, b) => a.redemptions - b.redemptions)
                .slice(0, 10)
                .map((stat) => {
                  const reward = rewardsList.find(r => r.id === stat.rewardId);
                  if (!reward) return null;
                  return (
                    <div key={stat.rewardId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{stat.title}</p>
                          <Badge variant="secondary" className="text-xs capitalize shrink-0">{stat.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{stat.redemptions} redeemed</span>
                          <span>{stat.currentStock} remaining</span>
                          <span className="text-orange-600 font-medium">{stat.redemptionRate.toFixed(1)}% rate</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-sm">{stat.totalPointsRedeemed.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          {/* Category Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            <div className="space-y-4">
              {['merchandise', 'discount', 'food', 'experience'].map((category) => {
                const categoryStats = redemptionStats.filter(s => s.category === category);
                const categoryRedemptions = categoryStats.reduce((sum, s) => sum + s.redemptions, 0);
                const categoryPoints = categoryStats.reduce((sum, s) => sum + s.totalPointsRedeemed, 0);
                const categoryAvgRate = categoryStats.length > 0
                  ? categoryStats.reduce((sum, s) => sum + s.redemptionRate, 0) / categoryStats.length
                  : 0;

                return (
                  <div key={category} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold capitalize">{category === 'food' ? 'Food & Beverage' : category}</h4>
                      <Badge variant="secondary">{categoryStats.length} rewards</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Redemptions</p>
                        <p className="text-lg font-bold">{categoryRedemptions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Points Redeemed</p>
                        <p className="text-lg font-bold">{categoryPoints.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Redemption Rate</p>
                        <p className="text-lg font-bold">{Math.round(categoryAvgRate)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Merchandise</span>
                  <span className="text-sm font-semibold">{merchandiseCount} ({totalRewards > 0 ? Math.round((merchandiseCount / totalRewards) * 100) : 0}%)</span>
                </div>
                <Progress value={totalRewards > 0 ? (merchandiseCount / totalRewards) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Discounts</span>
                  <span className="text-sm font-semibold">{discountCount} ({totalRewards > 0 ? Math.round((discountCount / totalRewards) * 100) : 0}%)</span>
                </div>
                <Progress value={totalRewards > 0 ? (discountCount / totalRewards) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Food & Beverage</span>
                  <span className="text-sm font-semibold">{foodCount} ({totalRewards > 0 ? Math.round((foodCount / totalRewards) * 100) : 0}%)</span>
                </div>
                <Progress value={totalRewards > 0 ? (foodCount / totalRewards) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Experiences</span>
                  <span className="text-sm font-semibold">{experienceCount} ({totalRewards > 0 ? Math.round((experienceCount / totalRewards) * 100) : 0}%)</span>
                </div>
                <Progress value={totalRewards > 0 ? (experienceCount / totalRewards) * 100 : 0} className="h-2" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Stock Availability */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Availability</h3>
            <div className="space-y-3">
              {[...rewardsList]
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 10)
                .map((reward) => (
                  <div key={reward.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{reward.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{reward.stock} left</span>
                        {reward.stock < 10 && (
                          <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                        )}
                      </div>
                    </div>
                    <Progress
                      value={Math.min((reward.stock / 100) * 100, 100)}
                      className="h-2"
                    />
                  </div>
                ))}
            </div>
          </Card>

          {/* Redemption Rate Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Redemption Rate Analysis</h3>
            <div className="space-y-4">
              {[...redemptionStats]
                .sort((a, b) => b.redemptionRate - a.redemptionRate)
                .slice(0, 8)
                .map((stat) => {
                  const reward = rewardsList.find(r => r.id === stat.rewardId);
                  if (!reward) return null;
                  return (
                    <div key={stat.rewardId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-sm truncate">{stat.title}</span>
                          <Badge variant="outline" className="text-xs capitalize shrink-0">{stat.category}</Badge>
                        </div>
                        <span className="text-sm font-semibold ml-2 shrink-0">{stat.redemptionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={stat.redemptionRate} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{stat.redemptions} / {stat.initialStock} redeemed</span>
                        <span>{stat.currentStock} remaining</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          {/* Price Range Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Price Range Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Low (0-500 pts)</p>
                <p className="text-2xl font-bold">
                  {rewardsList.filter(r => r.pointsRequired < 500).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">rewards</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Medium (500-1500 pts)</p>
                <p className="text-2xl font-bold">
                  {rewardsList.filter(r => r.pointsRequired >= 500 && r.pointsRequired < 1500).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">rewards</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">High (1500+ pts)</p>
                <p className="text-2xl font-bold">
                  {rewardsList.filter(r => r.pointsRequired >= 1500).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">rewards</p>
              </div>
            </div>
          </Card>

          {/* Most Expensive Rewards */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Most Expensive Rewards</h3>
            <div className="space-y-3">
              {[...rewardsList]
                .sort((a, b) => b.pointsRequired - a.pointsRequired)
                .slice(0, 10)
                .map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-sm truncate">{reward.title}</p>
                      <Badge variant="secondary" className="text-xs capitalize mt-1">{reward.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{reward.pointsRequired}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

