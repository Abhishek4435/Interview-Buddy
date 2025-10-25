import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { Building2, Calendar, Globe, Clock, Languages, Users, Edit, Plus, Trash2 } from "lucide-react";
import { AddUserDialog } from "@/components/AddUserDialog";
import { ArrowLeft } from "lucide-react";


const OrganizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["organization-users", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_users")
        .select("*")
        .eq("organization_id", id);
      
      if (error) throw error;
      
      // Fetch user profiles separately
      const userIds = data.map(u => u.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);
      
      // Combine data
      return data.map(user => ({
        ...user,
        profile: profiles?.find(p => p.id === user.user_id),
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-6">
          <div className="text-center">Organization not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Manage B2B organizations</span>
            <span>/</span>
            <span>Organization details</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted mb-4">
                {organization.logo_url ? (
                  <img
                    src={organization.logo_url}
                    alt={organization.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h2 className="text-xl font-bold mb-2">{organization.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                B2B {organization.id.slice(0, 8)}...
              </p>
              <div className="mb-4">
                <StatusBadge status={organization.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                5 Subscribers
              </p>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <div className="border-b px-6">
                <TabsList className="h-12">
                  <TabsTrigger value="details">Basic details</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Profile</h3>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Organization details</h4>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Organization ID</span>
                        <span>{organization.id.slice(0, 13)}...</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={organization.status} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Contact details</h4>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Primary email</span>
                        <span>{organization.contact_email || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Primary phone no.</span>
                        <span>{organization.contact_phone || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phone</span>
                        <span>{organization.contact_phone || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span>{organization.contact_email || "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Maximum Allowed Coordinators</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.max_coordinators} Coordinators</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Timezone</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.timezone}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Language</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.language}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Official website URL</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={organization.website_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {organization.website_url || "—"}
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Users</h3>
                  <Button size="sm" onClick={() => setIsAddUserDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">S. No</th>
                        <th className="p-3 text-left text-sm font-medium">User name</th>
                        <th className="p-3 text-left text-sm font-medium">Role</th>
                        <th className="p-3 text-left text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-muted-foreground">
                            No users found. Add your first user!
                          </td>
                        </tr>
                      ) : (
                        users?.map((user, index) => (
                          <tr key={user.id} className="border-b hover:bg-muted/20">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  {user.profile?.full_name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span>{user.profile?.full_name || "Unknown User"}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <StatusBadge status={user.role} />
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        organizationId={id!}
      />
    </div>
  );
};

export default OrganizationDetail;
