"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UpgradeRequest {
  id: string;
  user_email: string;
  requested_role: "premium" | "enterprise" | string;
  status: "PENDING" | "APPROVE" | "REJECT" | string;
  created_at: string;
  updated_at?: string;
  admin_note?: string;
}

export default function AdminUpgradesPage() {
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(
    null
  );
  const [reviewNote, setReviewNote] = useState("");
  const queryClient = useQueryClient();

  // Fetch pending upgrade requests
  const {
    data: upgradeRequests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["upgradeRequests"],
    queryFn: async () => {
      const res = await api.get("/admin/admin/upgrade-queue");
      return res.data as UpgradeRequest[];
    },
  });

  // Process upgrade request
  const processMutation = useMutation({
    mutationFn: async (data: {
      request_id: string;
      action: "approve" | "reject";
      note?: string;
    }) => {
      const res = await api.post("/admin/admin/execute-upgrade", {
        request_id: data.request_id,
        action: data.action === "approve" ? "APPROVE" : "REJECT",
        note: data.note ?? "",
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request processed successfully");
      queryClient.invalidateQueries({ queryKey: ["upgradeRequests"] });
      setSelectedRequest(null);
      setReviewNote("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to process request");
    },
  });

  const handleProcessRequest = (
    request: UpgradeRequest,
    action: "approve" | "reject"
  ) => {
    processMutation.mutate({
      request_id: request.id,
      action,
      note: reviewNote || undefined,
    });
  };

  const normalizeStatus = (status: string) => status.toUpperCase();

  const getStatusBadge = (status: string) => {
    switch (normalizeStatus(status)) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-700 text-yellow-400"
          >
            <Clock className="w-3 h-3 mr-1" />
            PENDING
          </Badge>
        );
      case "APPROVE":
        return (
          <Badge variant="outline" className="border-green-700 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            APPROVED
          </Badge>
        );
      case "REJECT":
        return (
          <Badge variant="outline" className="border-red-700 text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            REJECTED
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-900/30 text-purple-400 border-purple-700";
      case "admin":
        return "bg-red-900/30 text-red-400 border-red-700";
      case "premium":
        return "bg-blue-900/30 text-blue-400 border-blue-700";
      case "enterprise":
        return "bg-indigo-900/30 text-indigo-400 border-indigo-700";
      default:
        return "bg-zinc-900/30 text-zinc-400 border-zinc-700";
    }
  };

  const requests = upgradeRequests || [];
  const pendingRequests = requests.filter(
    (r) => normalizeStatus(r.status) === "PENDING"
  );
  const processedRequests = requests.filter(
    (r) => normalizeStatus(r.status) !== "PENDING"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upgrade Queue</h1>
          <p className="text-zinc-400">
            Review and process role upgrade requests
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-zinc-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-zinc-400">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {pendingRequests.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-zinc-400">Approved</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {
                requests.filter(
                  (r) => normalizeStatus(r.status) === "APPROVE"
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-zinc-400">Rejected</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {
                requests.filter(
                  (r) => normalizeStatus(r.status) === "REJECT"
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-zinc-400">Approval Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {requests.length > 0
                ? Math.round(
                    (requests.filter(
                      (r) => normalizeStatus(r.status) === "APPROVE"
                    ).length /
                      requests.length) *
                      100
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading requests...
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending upgrade requests</p>
              <p className="text-sm">All requests have been processed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-sm font-semibold text-zinc-300">
                          {request.user_email[0]?.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">
                            {request.user_email}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="text-sm text-zinc-400 flex items-center gap-4">
                          <span className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500">
                              Requested
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getRoleBadgeColor(
                                request.requested_role
                              )}`}
                            >
                              {request.requested_role.toUpperCase()}
                            </Badge>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                        variant="outline"
                        className="border-zinc-600"
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleProcessRequest(request, "approve")}
                        disabled={processMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleProcessRequest(request, "reject")}
                        disabled={processMutation.isPending}
                        variant="outline"
                        className="border-red-700 text-red-400 hover:bg-red-900/20"
                      >
                        {processMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {request.admin_note && (
                    <div className="mt-3 p-3 bg-zinc-700 rounded text-sm">
                      <strong className="text-zinc-300">Admin Note:</strong>{" "}
                      <span className="text-zinc-400">
                        {request.admin_note}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedRequest && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Review Request
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedRequest(null);
                  setReviewNote("");
                }}
                variant="outline"
                className="border-zinc-600"
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">User:</span>
                  <div className="font-semibold text-zinc-100">
                    {selectedRequest.user_email}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Requested Role:</span>
                  <div className="font-semibold text-zinc-100">
                    {selectedRequest.requested_role.toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Submitted:</span>
                  <div className="text-zinc-100">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Status:</span>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              {selectedRequest.admin_note && (
                <div className="mt-4">
                  <span className="text-zinc-500 text-sm">Admin Note:</span>
                  <div className="mt-1 p-3 bg-zinc-700 rounded text-sm text-zinc-300">
                    {selectedRequest.admin_note}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewNote">Review Note (Optional)</Label>
              <Textarea
                id="reviewNote"
                placeholder="Add notes about your decision..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleProcessRequest(selectedRequest, "approve")}
                disabled={processMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {processMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Approve Request
              </Button>
              <Button
                onClick={() => handleProcessRequest(selectedRequest, "reject")}
                disabled={processMutation.isPending}
                variant="outline"
                className="border-red-700 text-red-400 hover:bg-red-900/20"
              >
                {processMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processed Requests History */}
      {processedRequests.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Processed Requests ({processedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {processedRequests.slice(0, 20).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-xs font-semibold text-zinc-300">
                        {request.user_email[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {request.user_email}
                      </div>
                      <div className="text-xs text-zinc-400">
                        Requested: {request.requested_role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-zinc-500">
                      {new Date(
                        request.updated_at || request.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guidelines */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">
                Approval Criteria
              </h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Demonstrated trading activity</li>
                <li>• Positive account balance</li>
                <li>• Consistent platform usage</li>
                <li>• No violations of terms of service</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-red-400">Rejection Reasons</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Insufficient account activity</li>
                <li>• Negative account balance</li>
                <li>• Previous policy violations</li>
                <li>• Incomplete profile information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
