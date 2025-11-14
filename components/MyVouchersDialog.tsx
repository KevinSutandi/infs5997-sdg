import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./ui/tabs";
import { QRCode } from "./QRCode";
import { currentUser } from "@/data/mockData";
import { Gift, Calendar, Clock, Ticket, Trophy, AlertCircle } from "lucide-react";

interface MyVouchersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyVouchersDialog({
  open,
  onOpenChange,
}: MyVouchersDialogProps) {
  const vouchers = currentUser.vouchers || [];

  const activeVouchers = vouchers.filter(
    (v) => v.status === "active",
  );
  const usedVouchers = vouchers.filter(
    (v) => v.status === "used",
  );
  const expiringSoonVouchers = activeVouchers.filter((v) => {
    const daysUntilExpiry = Math.floor(
      (new Date(v.expiryDate).getTime() -
        new Date().getTime()) /
      (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
    );
    return days;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Ticket className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            My Vouchers
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            View and manage your redeemed vouchers
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Active ({activeVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="used" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Used ({usedVouchers.length})
            </TabsTrigger>
            <TabsTrigger value="expiring" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Expiring ({expiringSoonVouchers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="active"
            className="space-y-4 mt-6"
          >
            {activeVouchers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeVouchers.map((voucher) => (
                  <Card key={voucher.id} className="p-5 hover:shadow-lg transition-all border-l-4 border-l-green-500">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="p-2 bg-muted rounded-lg">
                          <QRCode
                            value={voucher.qrCode}
                            size={100}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <h3 className="text-lg font-bold mb-1 line-clamp-1">
                            {voucher.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {voucher.merchantName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1.5 px-2 rounded-md bg-muted/50">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Expires {formatDate(voucher.expiryDate)}
                          </span>
                        </div>
                        <Badge className="flex items-center gap-1 bg-amber-600 text-white border-0 w-fit">
                          <Trophy className="h-3 w-3" />
                          {voucher.points} points
                        </Badge>
                        <p className="text-xs text-muted-foreground italic pt-1">
                          {voucher.usageNote}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Active Vouchers</h3>
                <p className="text-muted-foreground">
                  Redeem rewards to get vouchers here
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="used" className="space-y-4 mt-6">
            {usedVouchers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usedVouchers.map((voucher) => (
                  <Card
                    key={voucher.id}
                    className="p-5 opacity-75 hover:opacity-100 transition-opacity border-l-4 border-l-gray-400"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-1 line-clamp-1">
                            {voucher.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {voucher.merchantName}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">Used</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground py-1.5 px-2 rounded-md bg-muted/50">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Used on {formatDate(voucher.usedDate!)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {voucher.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Used Vouchers</h3>
                <p className="text-muted-foreground">
                  Your used vouchers will appear here
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent
            value="expiring"
            className="space-y-4 mt-6"
          >
            {expiringSoonVouchers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expiringSoonVouchers.map((voucher) => {
                  const daysLeft = getDaysUntilExpiry(
                    voucher.expiryDate,
                  );
                  return (
                    <Card
                      key={voucher.id}
                      className="p-5 border-2 border-amber-300 bg-linear-to-br from-amber-50/80 via-amber-50/40 to-background hover:shadow-lg transition-all border-l-4 border-l-amber-500"
                    >
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="p-2 bg-muted rounded-lg">
                            <QRCode
                              value={voucher.qrCode}
                              size={100}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <h3 className="text-lg font-bold mb-1 line-clamp-1">
                              {voucher.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {voucher.merchantName}
                            </p>
                          </div>
                          <Badge
                            variant="destructive"
                            className="mb-2 font-semibold shadow-md"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground py-1.5 px-2 rounded-md bg-muted/50">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Expires {formatDate(voucher.expiryDate)}
                            </span>
                          </div>
                          <Badge className="flex items-center gap-1 bg-amber-600 text-white border-0 w-fit">
                            <Trophy className="h-3 w-3" />
                            {voucher.points} points
                          </Badge>
                          <p className="text-xs text-muted-foreground italic pt-1">
                            {voucher.usageNote}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Expiring Vouchers</h3>
                <p className="text-muted-foreground">
                  All your vouchers are still valid
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}