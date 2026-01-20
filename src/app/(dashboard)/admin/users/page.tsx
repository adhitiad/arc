"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { data: users, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data,
  });

  const upgradeMutation = useMutation({
    mutationFn: async ({ email, plan }: { email: string; plan: string }) => {
      return await api.post(`/admin/approve-upgrade/${email}?plan=${plan}`);
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      refetch();
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "enterprise" ? "default" : "secondary"
                      }
                    >
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.subscription_status}</TableCell>
                  <TableCell>
                    {user.requests_today} / {user.daily_requests_limit}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.role === "free" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() =>
                            upgradeMutation.mutate({
                              email: user.email,
                              plan: "premium",
                            })
                          }
                        >
                          <Check className="w-4 h-4 mr-1" /> Premium
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() =>
                            upgradeMutation.mutate({
                              email: user.email,
                              plan: "enterprise",
                            })
                          }
                        >
                          <Check className="w-4 h-4 mr-1" /> Enterprise
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
