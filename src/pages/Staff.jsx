import { KeyRound, Plus, Trash2, UserCog, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const Staff = () => {
	const { user } = useAuth();
	const [staff, setStaff] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [currentPwd, setCurrentPwd] = useState("");
	const [newPwd, setNewPwd] = useState("");
	const [confirmPwd, setConfirmPwd] = useState("");
	const [error, setError] = useState("");
	const [pwdError, setPwdError] = useState("");
	const [pwdSuccess, setPwdSuccess] = useState("");

	const load = async () => await authService.getStaffList().then(setStaff);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		load();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await authService.createStaff(username, password);
			setUsername("");
			setPassword("");
			setShowForm(false);
			load();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleDelete = async (id) => {
		await authService.deleteStaff(id);
		load();
	};

	const inputClass =
		"h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Staff Management
					</h1>
					<p className="text-sm text-muted-foreground">Admin only</p>
				</div>
				<button
					type="button"
					onClick={() => setShowForm(true)}
					className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<Plus size={16} /> Add Staff
				</button>
				<button
					type="button"
					onClick={() => {
						setShowPasswordForm(true);
						setPwdError("");
						setPwdSuccess("");
					}}
					className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
				>
					<KeyRound size={16} /> Change Password
				</button>
			</div>

			{showForm && (
				<div className="mb-6 rounded-xl border border-border bg-card p-5">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							New Staff Account
						</h2>
						<button
							type="button"
							onClick={() => setShowForm(false)}
							className="text-muted-foreground hover:text-foreground"
						>
							<X size={18} />
						</button>
					</div>
					{error && (
						<div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{error}
						</div>
					)}
					<form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
							className={inputClass}
							required
						/>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className={inputClass}
							required
						/>
						<button
							type="submit"
							className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Create
						</button>
					</form>
				</div>
			)}

			{showPasswordForm && (
				<div className="mb-6 rounded-xl border border-border bg-card p-5">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							Change Your Password
						</h2>
						<button
							type="button"
							onClick={() => setShowPasswordForm(false)}
							className="text-muted-foreground hover:text-foreground"
						>
							<X size={18} />
						</button>
					</div>
					{pwdError && (
						<div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{pwdError}
						</div>
					)}
					{pwdSuccess && (
						<div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
							{pwdSuccess}
						</div>
					)}
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							setPwdError("");
							setPwdSuccess("");
							if (newPwd !== confirmPwd) {
								setPwdError("Passwords do not match");
								return;
							}
							try {
								await authService.changePassword(user._id, currentPwd, newPwd);
								setPwdSuccess("Password changed successfully");
								setCurrentPwd("");
								setNewPwd("");
								setConfirmPwd("");
							} catch (err) {
								setPwdError(err.message);
							}
						}}
						className="grid gap-4 sm:grid-cols-4"
					>
						<input
							type="password"
							value={currentPwd}
							onChange={(e) => setCurrentPwd(e.target.value)}
							placeholder="Current password"
							className={inputClass}
							required
						/>
						<input
							type="password"
							value={newPwd}
							onChange={(e) => setNewPwd(e.target.value)}
							placeholder="New password"
							className={inputClass}
							required
						/>
						<input
							type="password"
							value={confirmPwd}
							onChange={(e) => setConfirmPwd(e.target.value)}
							placeholder="Confirm new password"
							className={inputClass}
							required
						/>
						<button
							type="submit"
							className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Update
						</button>
					</form>
				</div>
			)}
			<div className="overflow-x-auto rounded-xl border border-border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/50">
							<th className="px-4 py-3 text-left font-medium text-muted-foreground">
								Username
							</th>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground">
								Role
							</th>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground">
								Created
							</th>
							<th className="px-4 py-3 text-right font-medium text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{staff.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="px-4 py-8 text-center text-muted-foreground"
								>
									No staff accounts
								</td>
							</tr>
						) : (
							staff.map((s) => (
								<tr
									key={s._id}
									className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
								>
									<td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
										<UserCog size={16} className="text-muted-foreground" />
										{s.username}
									</td>
									<td className="px-4 py-3 text-muted-foreground capitalize">
										{s.role}
									</td>
									<td className="px-4 py-3 text-muted-foreground">
										{new Date(s.createdAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-3 text-right">
										<button
											type="button"
											onClick={() => handleDelete(s._id)}
											className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
										>
											<Trash2 size={15} />
										</button>
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

export default Staff;
