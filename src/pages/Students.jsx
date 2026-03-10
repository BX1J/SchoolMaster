/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { collection, doc, writeBatch } from "firebase/firestore";
import {
	AlertCircle,
	CheckCircle,
	Loader2,
	Pencil,
	Plus,
	Search,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase.js";
import { studentService } from "../services/studentService";

const emptyForm = { name: "", fatherName: "", phone: "", grade: "" };

const Students = () => {
	const [students, setStudents] = useState([]);
	const [search, setSearch] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [loading, setLoading] = useState(true);
	const [selectedClass, setSelectedClass] = useState("All");
	const currentMonth = new Date().toISOString().slice(0, 7);
	const fileInputRef = useRef();

	const load = (classNameToFetch) => {
    setLoading(true);
    studentService.getStudents(classNameToFetch)
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch:", error);
        setLoading(false);
      });
  };

  	useEffect(() => {
    load(selectedClass);
  }, [selectedClass]);

	const filtered = students.filter((s) =>
		s.name.toLowerCase().includes(search.toLowerCase()),
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
		load(selectedClass);
	};

	const handleEdit = (s) => {
		setForm({
			name: s.name,
			fatherName: s.fatherName,
			phone: s.phone,
			grade: s.grade,
		});
		setEditing(s._id);
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		await studentService.deleteStudent(id);
		load(selectedClass);
	};

	const handlePayFee = async (s) => {
		await studentService.updateStudent(s._id, {fees: {...s.fees, [currentMonth]: s.fees?.[currentMonth] === "Paid" ? "Pending" : "Paid"}});
		load(selectedClass);
	};

	const cancel = () => {
		setForm(emptyForm);
		setEditing(null);
		setShowForm(false);
	};

	const handleBulkUpload = () => {
		fileInputRef.current.click();
	};

	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setLoading(true); // Spin the wheel so the user knows it's working

		Papa.parse(file, {
			header: true, // This tells the parser to use the first row of the CSV as variable names
			skipEmptyLines: true,
			complete: async (results) => {
				try {
					// Initialize the payload rocket
					const batch = writeBatch(db);
					const studentsRef = collection(db, "students");

					// Loop through the CSV rows and pack the rocket
					results.data.forEach((row) => {
						const newDocRef = doc(studentsRef); // Generate a random ID for the new student
						batch.set(newDocRef, {
							name: row.name || "Unknown",
							fatherName: row.fatherName || "Unknown",
							phone: row.phone || "",
							grade: row.grade || "",
							feeStatus: "Pending",
							schoolId: auth.currentUser.uid, // <-- The Deadbolt
						});
					});

					// Fire the rocket
					await batch.commit();

					// Refresh the UI
					studentService.getStudents().then((data) => {
						setStudents(data);
						setLoading(false);
					});
				} catch (error) {
					console.error("Upload failed:", error);
					setLoading(false);
				} finally {
					e.target.value = null; // Reset the HTML input
				}
			},
		});
	};

const handleClassSelection = (e) => {
    setSelectedClass(e.target.value);
  };

	const inputClass =
		"h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Students</h1>
					<p className="text-sm text-muted-foreground">
						{loading ? (
							<Loader2 size={18} className="animate-spin" />
						) : (
							students.length
						)}{" "}
						total
					</p>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => {
							setShowForm(true);
							setEditing(null);
							setForm(emptyForm);
						}}
						className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						<Plus size={16} /> Add Student
					</button>
					<button
						type="button"
						onClick={handleBulkUpload}
						className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						<Upload size={16} /> Bulk Upload
					</button>
					<input
						type="file"
						accept=".csv"
						className="hidden"
						ref={fileInputRef}
						onChange={handleFileSelect}
					/>
				</div>
			</div>

			{/* Form */}
			{showForm && (
				<div className="mb-6 rounded-xl border border-border bg-card p-5">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							{editing ? "Edit Student" : "New Student"}
						</h2>
						<button
							type="button"
							onClick={cancel}
							className="text-muted-foreground hover:text-foreground"
						>
							<X size={18} />
						</button>
					</div>
					<form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
						<input
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Name"
							className={inputClass}
							required
						/>
						<input
							name="fatherName"
							value={form.fatherName}
							onChange={handleChange}
							placeholder="Father's Name"
							className={inputClass}
							required
						/>
						<input
							name="phone"
							value={form.phone}
							onChange={handleChange}
							placeholder="Phone"
							className={inputClass}
							required
						/>
						<input
							name="grade"
							value={form.grade}
							onChange={handleChange}
							placeholder="Grade / Class"
							className={inputClass}
							required
						/>
						<div className="sm:col-span-2">
							<button
								type="submit"
								className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							>
								{editing ? "Update" : "Add Student"}
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Search & Filter */}
			<div className="mb-4 flex gap-4">
				<div className="relative flex-1">
					<Search
						size={16}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by name..."
						className={`${inputClass} pl-9`}
					/>
				</div>
				<select
					value={selectedClass}
					onChange={handleClassSelection}
					className={`${inputClass} w-28 cursor-pointer`}
				>
					<option value="All">All Classes</option>
					<option value="KG">KG</option>
					<option value="Prep">Prep</option>
					<option value="One">One</option>
					<option value="Two">Two</option>
					<option value="Three">Three</option>
					<option value="Four">Four</option>
					<option value="Five">Five</option>
					<option value="Six">Six</option>
					<option value="Seven">Seven</option>
					<option value="Eight">Eight</option>
					<option value="Nine">Nine</option>
					<option value="Ten">Ten</option>
				</select>
			</div>

			{/* Table */}

			<div className="overflow-x-auto rounded-xl border border-border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/50">
							<th className="px-4 py-3 text-left font-medium text-muted-foreground">
								Name
							</th>
							<th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
								Father
							</th>
							<th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
								Phone
							</th>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground">
								Grade
							</th>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground">
								Fee
							</th>
							<th className="px-4 py-3 text-right font-medium text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>

					<tbody>
						{filtered.length === 0 ? (
							<tr>
								<td
									colSpan={6}
									className="px-4 py-8 text-center text-muted-foreground"
								>
									No students found
								</td>
							</tr>
						) : (
							filtered.map((s) => (
								<tr
									key={s._id}
									className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
								>
									<td className="px-4 py-3 font-medium text-foreground">
										{s.name}
									</td>
									<td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
										{s.fatherName}
									</td>
									<td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
										{s.phone}
									</td>
									<td className="px-4 py-3 text-muted-foreground">{s.grade}</td>
									<td className="px-4 py-3">
										<button
											type="button"
											onClick={() => handlePayFee(s)}
											className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
												s.fees?.[currentMonth] === "Paid"
													? "bg-success/10 text-success hover:bg-success/20"
													: "bg-warning/10 text-warning hover:bg-warning/20"
											}`}
										>
											{s.fees?.[currentMonth] === "Paid" ? (
												<CheckCircle size={12} />
											) : (
												<AlertCircle size={12} />
											)}
											{s.feeStatus}
										</button>
									</td>
									<td className="px-4 py-3 text-right">
										<div className="flex items-center justify-end gap-1">
											<button
												type="button"
												onClick={() => handleEdit(s)}
												className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
											>
												<Pencil size={15} />
											</button>
											<button
												type="button"
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
