'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { availableActivities } from '@/data/mockData';
import { AvailableActivity, SDG_GOALS, PointsBreakdown } from '@/types';
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Users, Award, BarChart3, TrendingUp, Calculator, Info, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Slider } from '../../ui/slider';
import { QRCodeDialog } from '../QRCodeDialog';

// Local storage key for activities (in real app, this would be API calls)
const ACTIVITIES_STORAGE_KEY = 'sdg-admin-activities';

// Helper function to format dates consistently (prevents hydration mismatches)
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Use consistent format: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function ActivityManagement() {
  const [activities, setActivities] = useState<AvailableActivity[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as AvailableActivity[];
        } catch (error) {
          console.error('Error parsing activities:', error);
        }
      }
    }
    return availableActivities;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<AvailableActivity | null>(null);
  const [qrCodeEvent, setQrCodeEvent] = useState<{ id: string; title: string } | null>(null);
  const [formData, setFormData] = useState<Partial<AvailableActivity>>({
    title: '',
    description: '',
    category: 'event',
    organizer: '',
    location: '',
    points: 0,
    startDate: '',
    endDate: '',
    capacity: undefined,
    enrolled: 0,
    imageUrl: '',
    sdgGoals: [],
    pointsBreakdown: undefined,
  });

  // Points calculator state
  const [timeCommitmentHours, setTimeCommitmentHours] = useState(1);
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [pointsExplanation, setPointsExplanation] = useState('');
  const [useCalculator, setUseCalculator] = useState(true);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities]);

  // Calculate points based on breakdown (memoized to avoid re-renders)
  // Note: SDG count no longer contributes to points - all SDGs are equally important
  const calculatePoints = useCallback((hours: number, difficulty: number, sdgCount: number, explanation: string): PointsBreakdown => {
    const timePoints = hours * 15; // Increased weight for time commitment
    const difficultyPoints = difficulty * 5; // Decreased weight for difficulty
    const impactPoints = 0; // SDG count no longer contributes to points
    const total = timePoints + difficultyPoints;

    return {
      timeCommitment: timePoints,
      difficulty: difficultyPoints,
      sdgImpact: impactPoints,
      total,
      explanation: explanation || undefined,
    };
  }, []);

  // Force calculator for events
  const isEvent = formData.category === 'event';
  const effectiveUseCalculator = isEvent ? true : useCalculator;

  // Get calculated points (computed value, not effect)
  const calculatedBreakdown = effectiveUseCalculator
    ? calculatePoints(
      timeCommitmentHours,
      difficultyLevel,
      formData.sdgGoals?.length || 0,
      pointsExplanation
    )
    : null;

  // Sync calculated points to formData when calculator is enabled
  const currentPoints = effectiveUseCalculator && calculatedBreakdown ? calculatedBreakdown.total : formData.points;

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'event',
      organizer: '',
      location: '',
      points: 0,
      startDate: '',
      endDate: '',
      capacity: undefined,
      enrolled: 0,
      imageUrl: '',
      sdgGoals: [],
      pointsBreakdown: undefined,
    });
    setTimeCommitmentHours(1);
    setDifficultyLevel(3);
    setPointsExplanation('');
    setUseCalculator(true);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (activity: AvailableActivity) => {
    setSelectedActivity(activity);
    setFormData({
      ...activity,
      sdgGoals: activity.sdgGoals || [],
    });

    // For events, always use calculator
    if (activity.category === 'event') {
      if (activity.pointsBreakdown) {
        // Extract values from breakdown (using new multipliers: /15 and /5)
        setTimeCommitmentHours(activity.pointsBreakdown.timeCommitment / 15);
        setDifficultyLevel(activity.pointsBreakdown.difficulty / 5);
        setPointsExplanation(activity.pointsBreakdown.explanation || '');
      } else {
        // Default values if no breakdown exists
        setTimeCommitmentHours(1);
        setDifficultyLevel(3);
        setPointsExplanation('');
      }
      setUseCalculator(true);
    } else {
      // For non-events, check if breakdown exists
      if (activity.pointsBreakdown) {
        setTimeCommitmentHours(activity.pointsBreakdown.timeCommitment / 15);
        setDifficultyLevel(activity.pointsBreakdown.difficulty / 5);
        setPointsExplanation(activity.pointsBreakdown.explanation || '');
        setUseCalculator(true);
      } else {
        setTimeCommitmentHours(1);
        setDifficultyLevel(3);
        setPointsExplanation('');
        setUseCalculator(false);
      }
    }

    setIsEditDialogOpen(true);
  };

  const handleDelete = (activity: AvailableActivity) => {
    setSelectedActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    // Use calculated points if calculator is enabled
    const finalPoints = currentPoints;
    const finalBreakdown = effectiveUseCalculator && calculatedBreakdown ? calculatedBreakdown : formData.pointsBreakdown;

    // Validation
    if (!formData.title || !formData.description || !formData.organizer || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!formData.startDate) {
      toast.error('Start date is required');
      return;
    }
    if (formData.sdgGoals?.length === 0) {
      toast.error('Please select at least one SDG goal');
      return;
    }
    if (finalPoints === undefined || finalPoints <= 0) {
      toast.error('Points must be greater than 0');
      return;
    }

    if (isCreateDialogOpen) {
      // Create new activity
      const newActivity: AvailableActivity = {
        id: `avail-${Date.now()}`,
        title: formData.title!,
        description: formData.description!,
        category: formData.category as 'coursework' | 'society' | 'event',
        organizer: formData.organizer!,
        location: formData.location!,
        points: finalPoints!,
        startDate: formData.startDate!,
        endDate: formData.endDate || undefined,
        capacity: formData.capacity || undefined,
        enrolled: formData.enrolled || 0,
        imageUrl: formData.imageUrl || undefined,
        sdgGoals: formData.sdgGoals || [],
        pointsBreakdown: finalBreakdown,
      };
      setActivities([...activities, newActivity]);
      toast.success('Activity created successfully');
      setIsCreateDialogOpen(false);
    } else if (isEditDialogOpen && selectedActivity) {
      // Update existing activity
      const updatedActivities = activities.map(a =>
        a.id === selectedActivity.id
          ? {
            ...a,
            title: formData.title!,
            description: formData.description!,
            category: formData.category as 'coursework' | 'society' | 'event',
            organizer: formData.organizer!,
            location: formData.location!,
            points: finalPoints!,
            startDate: formData.startDate!,
            endDate: formData.endDate || undefined,
            capacity: formData.capacity || undefined,
            enrolled: formData.enrolled || 0,
            imageUrl: formData.imageUrl || undefined,
            sdgGoals: formData.sdgGoals || [],
            pointsBreakdown: finalBreakdown,
          }
          : a
      );
      setActivities(updatedActivities);
      toast.success('Activity updated successfully');
      setIsEditDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedActivity) {
      setActivities(activities.filter(a => a.id !== selectedActivity.id));
      toast.success('Activity deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  const toggleSDG = (sdgNumber: number) => {
    const currentGoals = formData.sdgGoals || [];
    if (currentGoals.includes(sdgNumber)) {
      setFormData({ ...formData, sdgGoals: currentGoals.filter(n => n !== sdgNumber) });
    } else {
      setFormData({ ...formData, sdgGoals: [...currentGoals, sdgNumber] });
    }
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalActivities = activities.length;
  const courseworkCount = activities.filter(a => a.category === 'coursework').length;
  const societyCount = activities.filter(a => a.category === 'society').length;
  const eventCount = activities.filter(a => a.category === 'event').length;
  const totalCapacity = activities.reduce((sum, a) => sum + (a.capacity || 0), 0);
  const totalEnrolled = activities.reduce((sum, a) => sum + (a.enrolled || 0), 0);
  const averagePoints = activities.length > 0
    ? Math.round(activities.reduce((sum, a) => sum + a.points, 0) / activities.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity & Event Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage platform activities and events
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Activity
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{totalActivities}</p>
          <p className="text-sm text-muted-foreground">Total Activities</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">{totalEnrolled}</p>
          <p className="text-sm text-muted-foreground">Total Enrolled</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold">{averagePoints}</p>
          <p className="text-sm text-muted-foreground">Avg Points/Activity</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-500" />
          </div>
          <p className="text-2xl font-bold">
            {totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0}%
          </p>
          <p className="text-sm text-muted-foreground">Fill Rate</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Activity List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card className="p-4 bg-muted/30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="coursework">Coursework</SelectItem>
                  <SelectItem value="society">Society</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Activities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{activity.title}</h3>
                      <Badge className="capitalize">{activity.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{activity.organizer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(activity.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <Award className="h-4 w-4 text-amber-600" />
                      <span>{activity.points} points</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {activity.sdgGoals.map(sdgNum => {
                      const sdg = SDG_GOALS.find(s => s.number === sdgNum);
                      return sdg ? (
                        <div
                          key={sdgNum}
                          className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold shadow-md ${
                            sdg.textColor === 'black' ? 'text-black' : 'text-white'
                          }`}
                          style={{ 
                            backgroundColor: sdg.color,
                            textShadow: sdg.textColor === 'white' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.5)'
                          }}
                          title={sdg.name}
                        >
                          {sdgNum}
                        </div>
                      ) : null;
                    })}
                  </div>

                  {activity.capacity && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Capacity</span>
                        <span>{activity.enrolled || 0} / {activity.capacity}</span>
                      </div>
                      <Progress
                        value={Math.min(((activity.enrolled || 0) / activity.capacity) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    {activity.category === 'event' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQrCodeEvent({ id: activity.id, title: activity.title })}
                        className="flex-1"
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        QR Code
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(activity)}
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

          {filteredActivities.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No activities found</p>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Coursework</span>
                  <span className="text-sm font-semibold">{courseworkCount} ({totalActivities > 0 ? Math.round((courseworkCount / totalActivities) * 100) : 0}%)</span>
                </div>
                <Progress value={totalActivities > 0 ? (courseworkCount / totalActivities) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Society Activities</span>
                  <span className="text-sm font-semibold">{societyCount} ({totalActivities > 0 ? Math.round((societyCount / totalActivities) * 100) : 0}%)</span>
                </div>
                <Progress value={totalActivities > 0 ? (societyCount / totalActivities) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Events</span>
                  <span className="text-sm font-semibold">{eventCount} ({totalActivities > 0 ? Math.round((eventCount / totalActivities) * 100) : 0}%)</span>
                </div>
                <Progress value={totalActivities > 0 ? (eventCount / totalActivities) * 100 : 0} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Top Activities by Enrollment */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Activities by Enrollment</h3>
            <div className="space-y-3">
              {[...activities]
                .filter(a => a.capacity)
                .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
                .slice(0, 10)
                .map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-sm truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">{activity.category}</Badge>
                        <span className="text-xs text-muted-foreground">{activity.organizer}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{activity.enrolled || 0}/{activity.capacity}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.capacity ? Math.round(((activity.enrolled || 0) / activity.capacity) * 100) : 0}% full
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* SDG Coverage */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">SDG Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {SDG_GOALS.map((sdg) => {
                const activityCount = activities.filter(a => a.sdgGoals.includes(sdg.number)).length;
                return (
                  <div key={sdg.number} className="text-center p-3 bg-muted/30 rounded-lg">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-2"
                      style={{ backgroundColor: sdg.color }}
                    >
                      {sdg.number}
                    </div>
                    <p className="text-xl font-bold">{activityCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">activities</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedActivity(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? 'Create New Activity' : 'Edit Activity'}</DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen ? 'Add a new activity or event to the platform' : 'Update activity details'}
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
                placeholder="Activity title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Activity description"
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) => {
                  const category = value as 'coursework' | 'society' | 'event';
                  setFormData({ ...formData, category });
                  // Force calculator for events
                  if (category === 'event') {
                    setUseCalculator(true);
                  }
                }}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coursework">Coursework</SelectItem>
                  <SelectItem value="society">Society</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Points Calculator */}
            <Card className="p-4 border-amber-200 bg-amber-50/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-amber-600" />
                    <Label className="text-base font-semibold">Points Calculator</Label>
                  </div>
                  {formData.category === 'event' ? (
                    <Badge variant="secondary" className="text-xs">
                      Required for events
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="use-calculator" className="text-sm font-normal">Use calculator</Label>
                      <Checkbox
                        id="use-calculator"
                        checked={useCalculator}
                        onCheckedChange={(checked) => setUseCalculator(checked as boolean)}
                      />
                    </div>
                  )}
                </div>

                {(useCalculator || formData.category === 'event') ? (
                  <>
                    <div className="bg-background/80 p-3 rounded-lg border space-y-3">
                      {/* Time Commitment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Time Commitment (hours)</Label>
                          <Badge variant="secondary">{timeCommitmentHours}h × 15 = {timeCommitmentHours * 15} pts</Badge>
                        </div>
                        <Slider
                          value={[timeCommitmentHours]}
                          onValueChange={(value) => setTimeCommitmentHours(value[0])}
                          min={0.5}
                          max={20}
                          step={0.5}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">How many hours will this activity take?</p>
                      </div>

                      {/* Difficulty */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Difficulty Level</Label>
                          <Badge variant="secondary">{difficultyLevel} × 5 = {difficultyLevel * 5} pts</Badge>
                        </div>
                        <Slider
                          value={[difficultyLevel]}
                          onValueChange={(value) => setDifficultyLevel(value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 - Low Effort</span>
                          <span>3 - Moderate</span>
                          <span>5 - High Effort</span>
                        </div>
                        <div className="mt-2 p-2 bg-muted/50 rounded-md text-xs space-y-1">
                          <p className="font-semibold">Examples:</p>
                          <p><strong>Level 1:</strong> Crowd control, ushering, simple setup tasks</p>
                          <p><strong>Level 2:</strong> Basic event assistance, simple data entry</p>
                          <p><strong>Level 3:</strong> Event coordination, moderate planning tasks</p>
                          <p><strong>Level 4:</strong> Complex event management, research projects</p>
                          <p><strong>Level 5:</strong> Consulting work, strategic planning, high-stakes decision making</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Points Display */}
                    <div className="bg-linear-to-r from-amber-500/10 to-amber-600/10 p-4 rounded-lg border-2 border-amber-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            This activity will reward <span className="font-semibold">{currentPoints}</span> SDG points
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-6 w-6 text-amber-600" />
                          <span className="text-3xl font-bold text-amber-600">{currentPoints}</span>
                        </div>
                      </div>
                    </div>

                    {/* Optional Explanation */}
                    <div className="space-y-2">
                      <Label htmlFor="points-explanation" className="text-sm flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        Additional Explanation (Optional)
                      </Label>
                      <Textarea
                        id="points-explanation"
                        value={pointsExplanation}
                        onChange={(e) => setPointsExplanation(e.target.value)}
                        placeholder="Add any additional context about how these points were determined..."
                        rows={2}
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This explanation will be shown to students to increase transparency
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="points-manual">Points <span className="text-destructive">*</span></Label>
                    <Input
                      id="points-manual"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                      placeholder="Enter SDG points manually"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enable the calculator for transparent, automated point calculation
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Organizer and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer <span className="text-destructive">*</span></Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Organization or department"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Event location"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-destructive">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Maximum participants"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value || undefined })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* SDG Goals */}
            <div className="space-y-2">
              <Label>SDG Goals <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg max-h-64 overflow-y-auto">
                {SDG_GOALS.map((sdg) => (
                  <div key={sdg.number} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sdg-${sdg.number}`}
                      checked={formData.sdgGoals?.includes(sdg.number) || false}
                      onCheckedChange={() => toggleSDG(sdg.number)}
                    />
                    <Label
                      htmlFor={`sdg-${sdg.number}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <span
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                          sdg.textColor === 'black' ? 'text-black' : 'text-white'
                        }`}
                        style={{ 
                          backgroundColor: sdg.color,
                          textShadow: sdg.textColor === 'white' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.5)'
                        }}
                      >
                        {sdg.number}
                      </span>
                      <span>{sdg.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
              {formData.sdgGoals && formData.sdgGoals.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formData.sdgGoals.length} SDG goal{formData.sdgGoals.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedActivity(null);
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
              This will permanently delete &quot;{selectedActivity?.title}&quot;. This action cannot be undone.
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

      {qrCodeEvent && (
        <QRCodeDialog
          open={!!qrCodeEvent}
          onOpenChange={(open) => !open && setQrCodeEvent(null)}
          eventId={qrCodeEvent.id}
          eventTitle={qrCodeEvent.title}
        />
      )}
    </div>
  );
}


