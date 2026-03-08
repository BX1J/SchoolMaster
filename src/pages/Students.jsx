import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Plus, Search, Pencil, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';

const emptyForm = { name: '', fatherName: '', phone: '', grade: '' };

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => studentService.getStudents().then(setStudents);

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await studentService.updateStudent(editing, form);
    } else {
      await studentService.addStudent(form);
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, fatherName: s.fatherName, phone: s.phone, grade: s.grade });
    setEditing(s._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await studentService.deleteStudent(id);
    load();
  };

  const handlePayFee = async (s) => {
    await studentService.updateStudent(s._id, { feeStatus: s.feeStatus === 'Paid' ? 'Pending' : 'Paid' });
    load();
  };

  const cancel = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const inputClass =
    'h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">{students.length} total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {editing ? 'Edit Student' : 'New Student'}
            </h2>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className={inputClass} required />
            <input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's Name" className={inputClass} required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} required />
            <input name="grade" value={form.grade} onChange={handleChange} placeholder="Grade / Class" className={inputClass} required />
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {editing ? 'Update' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className={`${inputClass} pl-9`}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Father</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fee</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No students found
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{s.fatherName}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{s.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.grade}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePayFee(s)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        s.feeStatus === 'Paid'
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-warning/10 text-warning hover:bg-warning/20'
                      }`}
                    >
                      {s.feeStatus === 'Paid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {s.feeStatus}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(s)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
