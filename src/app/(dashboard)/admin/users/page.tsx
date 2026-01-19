"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  role: "free" | "premium" | "admin" | "owner";
  created_at: string;
  last_login?: string;
  is_active: boolean;
  api_key?: string;
  balance?: {
    stock_idr: number;
    forex_usd: number;
  };
  telegram_id?: string;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  // Search users
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", searchTerm, roleFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("q", searchTerm);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await api.get(`/user/admin/search-user?${params.toString()}`);
      return res.data as User[];
    },
  });

  // Upgrade user role
  const upgradeMutation = useMutation({
    mutationFn: async (data: {
      request_id: string;
      action: string;
      note?: string;
    }) => {
      const res = await api.post("/admin/execute-upgrade", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update user role");
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    upgradeMutation.mutate({
      request_id: userId,
      action: newRole,
      note: `Admin manually changed role to ${newRole}`,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-900/30 text-purple-400 border-purple-700";
      case "admin":
        return "bg-red-900/30 text-red-400 border-red-700";
      case "premium":
        return "bg-blue-900/30 text-blue-400 border-blue-700";
      default:
        return "bg-zinc-900/30 text-zinc-400 border-zinc-700";
    }
  };

  const filteredUsers = users || [];

  const roleStats = {
    free: filteredUsers.filter((u) => u.role === "free").length,
    premium: filteredUsers.filter((u) => u.role === "premium").length,
    admin: filteredUsers.filter((u) => u.role === "admin").length,
    owner: filteredUsers.filter((u) => u.role === "owner").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-400">Search and manage user accounts</p>
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

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-zinc-400">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {filteredUsers.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5 text-green-400" />
              <span className="text-sm text-zinc-400">Premium Users</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {roleStats.premium}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-zinc-400">Admins</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {roleStats.admin + roleStats.owner}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserX className="w-5 h-5 text-zinc-400" />
              <span className="text-sm text-zinc-400">Free Users</span>
            </div>
            <div className="text-2xl font-bold text-zinc-400">
              {roleStats.free}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role Filter</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-sm font-semibold text-zinc-300">
                          {user.email[0]?.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">
                            {user.email}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                          {!user.is_active && (
                            <Badge
                              variant="outline"
                              className="border-red-700 text-red-400"
                            >
                              INACTIVE
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-zinc-400 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Joined{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                          {user.last_login && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              Last login{" "}
                              {new Date(user.last_login).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Role Management */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-zinc-400">Role:</Label>
                        <Select
                          value={user.role}
                          onValueChange={(newRole) =>
                            handleRoleChange(user.id, newRole)
                          }
                          disabled={upgradeMutation.isPending}
                        >
                          <SelectTrigger className="w-24 bg-zinc-700 border-zinc-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* User Details */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                        onClick={() => {
                          // Show user details modal
                          toast.info(`User ID: ${user.id}`);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(user.balance || user.telegram_id) && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {user.balance && (
                          <div>
                            <span className="text-zinc-500">Balance:</span>
                            <span className="ml-2 text-zinc-300">
                              IDR {user.balance.stock_idr.toLocaleString()} /
                              USD {user.balance.forex_usd}
                            </span>
                          </div>
                        )}
                        {user.telegram_id && (
                          <div>
                            <span className="text-zinc-500">Telegram:</span>
                            <span className="ml-2 text-zinc-300">
                              {user.telegram_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Actions Guide */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Role Management</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>
                  • <strong>Free:</strong> Basic access, limited signals
                </li>
                <li>
                  • <strong>Premium:</strong> Full features, unlimited access
                </li>
                <li>
                  • <strong>Admin:</strong> User management, system oversight
                </li>
                <li>
                  • <strong>Owner:</strong> Full system control, file access
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Best Practices</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Review user activity before role changes</li>
                <li>• Document role change reasons</li>
                <li>• Monitor premium user engagement</li>
                <li>• Regular security audits of admin accounts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
