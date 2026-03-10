/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { AlertCircle, CheckCircle, GraduationCap, Loader2,Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';

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
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    studentService.getStudents("All")
      .then((data)=>{
        setStudents(data);
        setLoading(false);})
      .catch((err) => { console.error(err); setLoading(false); });
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
          value={loading ? <Loader2 size={18} className="animate-spin" /> : students.length}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={CheckCircle}
          label="Fees Paid"
          value={loading ? <Loader2 size={18} className="animate-spin" /> : paid}
          color="bg-success/10 text-success"
        />
        <StatCard
          icon={AlertCircle}
          label="Fees Pending"
          value={loading ? <Loader2 size={18} className="animate-spin" /> : pending}
          color="bg-warning/10 text-warning"
        />
        <StatCard
          icon={GraduationCap}
          label="Role"
          value={loading ? <Loader2 size={18} className="animate-spin" /> : user?.role}
          color="bg-accent text-accent-foreground"
        />
      </div>
    </div>
  );
};

export default Dashboard;
