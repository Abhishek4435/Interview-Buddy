import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { AddOrganizationDialog } from "@/components/AddOrganizationDialog";
import { useNavigate } from "react-router-dom";


const Organizations = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage B2B Organizations</h1>
            <p className="text-sm text-muted-foreground">
              Manage your B2B organizations
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <h2 className="font-semibold">B2B organizations</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="p-4 text-left font-medium">S. No</th>
                  <th className="p-4 text-left font-medium">Organization</th>
                  <th className="p-4 text-left font-medium">No of pending requests</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : organizations?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No organizations found. Add your first organization!
                    </td>
                  </tr>
                ) : (
                  organizations?.map((org, index) => (
                    <tr key={org.id} className="border-b hover:bg-muted/20">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            {org.logo_url ? (
                              <img
                                src={org.logo_url}
                                alt={org.name}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium">{org.name}</span>
                        </div>
                      </td>
                      <td className="p-4">45 pending requests</td>
                      <td className="p-4">
                        <StatusBadge status={org.status} />
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/organizations/${org.id}`)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <AddOrganizationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Organizations;
