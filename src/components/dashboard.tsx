import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Zap, Calendar } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded bg-[#272727] p-1.5 text-foreground-light shadow-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">+3 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded bg-[#272727] p-1.5 text-foreground-light shadow-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm font-medium">
            Total Applicants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">+12% from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded bg-[#272727] p-1.5 text-foreground-light shadow-sm">
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm font-medium">
            AI Screening Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89%</div>
          <p className="text-xs text-muted-foreground">+5% efficiency gain</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded bg-[#272727] p-1.5 text-foreground-light shadow-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm font-medium">
            Interviews Scheduled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">This week</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
