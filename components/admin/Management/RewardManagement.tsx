'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { rewardsCatalog } from '@/data/mockData';
import { Reward } from '@/types';
import { Plus, Search, Edit, Trash2, Gift, DollarSign, TrendingUp, Package, Award } from 'lucide-react';
import { toast } from 'sonner';

// Local storage key for rewards (in real app, this would be API calls)
const REWARDS_STORAGE_KEY = 'sdg-admin-rewards';

export function RewardManagement() {
  const [rewardsList, setRewardsList] = useState<Reward[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(REWARDS_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Failed to parse rewards from localStorage:', error);
        }
      }
    }
    return rewardsCatalog;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState<Partial<Reward>>({
    title: '',
    description: '',
    pointsRequired: 0,
    category: 'merchandise',
    imageUrl: '',
    stock: 0,
    expiryDate: '',
    merchantName: '',
    usageNote: '',
  });

  // Save rewards to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewardsList));
    }
  }, [rewardsList]);

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      pointsRequired: 0,
      category: 'merchandise',
      imageUrl: '',
      stock: 0,
      expiryDate: '',
      merchantName: '',
      usageNote: '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setFormData({ ...reward });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (reward: Reward) => {
    setSelectedReward(reward);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    // Validation
    if (!formData.title || !formData.description || !formData.merchantName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.pointsRequired === undefined || formData.pointsRequired <= 0) {
      toast.error('Points required must be greater than 0');
      return;
    }

    if (isCreateDialogOpen) {
      // Create new reward
      const newReward: Reward = {
        id: `reward-${Date.now()}`,
        title: formData.title!,
        description: formData.description!,
        pointsRequired: formData.pointsRequired!,
        category: formData.category!,
        imageUrl: formData.imageUrl || '',
        stock: formData.stock || 0,
        expiryDate: formData.expiryDate || '',
        merchantName: formData.merchantName!,
        usageNote: formData.usageNote || '',
      };
      setRewardsList([...rewardsList, newReward]);
      toast.success('Reward created successfully');
      setIsCreateDialogOpen(false);
    } else if (isEditDialogOpen && selectedReward) {
      // Update existing reward
      const updatedRewards = rewardsList.map(r =>
        r.id === selectedReward.id
          ? {
            ...r,
            title: formData.title!,
            description: formData.description!,
            pointsRequired: formData.pointsRequired!,
            category: formData.category!,
            imageUrl: formData.imageUrl || '',
            stock: formData.stock || 0,
            expiryDate: formData.expiryDate || '',
            merchantName: formData.merchantName!,
            usageNote: formData.usageNote || '',
          }
          : r
      );
      setRewardsList(updatedRewards);
      toast.success('Reward updated successfully');
      setIsEditDialogOpen(false);
      setSelectedReward(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedReward) {
      setRewardsList(rewardsList.filter(r => r.id !== selectedReward.id));
      toast.success('Reward deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedReward(null);
    }
  };

  // Filter rewards
  const filteredRewards = rewardsList.filter(reward => {
    return reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate statistics
  const totalRewards = rewardsList.length;
  const totalStock = rewardsList.reduce((sum, r) => sum + r.stock, 0);
  const averageCost = rewardsList.length > 0
    ? Math.round(rewardsList.reduce((sum, r) => sum + r.pointsRequired, 0) / rewardsList.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reward Management</h1>
          <p className="text-muted-foreground">
            Create and manage rewards that students can redeem with their SDG points
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Reward
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Gift className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{totalRewards}</p>
          <p className="text-sm text-muted-foreground">Total Rewards</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">{totalStock}</p>
          <p className="text-sm text-muted-foreground">Total Stock</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold">{averageCost}</p>
          <p className="text-sm text-muted-foreground">Avg Cost (Points)</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-500" />
          </div>
          <p className="text-2xl font-bold">{rewardsList.filter(r => r.stock && r.stock > 0).length}</p>
          <p className="text-sm text-muted-foreground">In Stock</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 bg-muted/30">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map((reward) => (
          <Card key={reward.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{reward.title}</h3>
                  <Badge className="capitalize">{reward.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{reward.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Points Required</span>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold">{reward.pointsRequired}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Stock</span>
                    <span>{reward.stock} available</span>
                  </div>
                  <Progress
                    value={reward.stock > 0 ? Math.min((reward.stock / 100) * 100, 100) : 0}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(reward)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(reward)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No rewards found</p>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedReward(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? 'Create New Reward' : 'Edit Reward'}</DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen ? 'Add a new reward to the catalog' : 'Update reward details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Reward title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Reward description"
                rows={3}
              />
            </div>

            {/* Category and Points Required */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Reward['category'] })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="merchandise">Merchandise</option>
                  <option value="discount">Discount</option>
                  <option value="food">Food & Beverage</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointsRequired">Points Required <span className="text-destructive">*</span></Label>
                <Input
                  id="pointsRequired"
                  type="number"
                  min="1"
                  value={formData.pointsRequired}
                  onChange={(e) => setFormData({ ...formData, pointsRequired: parseInt(e.target.value) || 0 })}
                  placeholder="Points required"
                />
              </div>
            </div>

            {/* Merchant and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="merchantName">Merchant Name <span className="text-destructive">*</span></Label>
                <Input
                  id="merchantName"
                  value={formData.merchantName || ''}
                  onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                  placeholder="Merchant or provider"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock <span className="text-destructive">*</span></Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  placeholder="Available quantity"
                />
              </div>
            </div>

            {/* Image URL and Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ''}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            {/* Usage Note */}
            <div className="space-y-2">
              <Label htmlFor="usageNote">Usage Note (Optional)</Label>
              <Textarea
                id="usageNote"
                value={formData.usageNote || ''}
                onChange={(e) => setFormData({ ...formData, usageNote: e.target.value })}
                placeholder="Instructions for using this reward"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedReward(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isCreateDialogOpen ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{selectedReward?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

