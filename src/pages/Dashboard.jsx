import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    studentService.getStudents().then(setStudents);
  }, []);

  const paid = students.filter((s) => s.feeStatus === 'Paid').length;
  const pending = students.filter((s) => s.feeStatus === 'Pending').length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.username}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={students.length}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={CheckCircle}
          label="Fees Paid"
          value={paid}
          color="bg-success/10 text-success"
        />
        <StatCard
          icon={AlertCircle}
          label="Fees Pending"
          value={pending}
          color="bg-warning/10 text-warning"
        />
        <StatCard
          icon={GraduationCap}
          label="Role"
          value={user?.role}
          color="bg-accent text-accent-foreground"
        />
      </div>
    </div>
  );
};

export default Dashboard;
