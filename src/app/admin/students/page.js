"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Shield, Search, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminStudents() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --- Fetch Users ---
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users"); // Admin Route
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Search Logic ---
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(lowerSearch) || 
      u.email.toLowerCase().includes(lowerSearch) ||
      (u.studentId && u.studentId.toLowerCase().includes(lowerSearch)) ||
      (u.phone && u.phone.includes(lowerSearch))
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // --- Make Admin ---
  const handleMakeAdmin = async (id) => {
    if(!confirm("Are you sure you want to promote this user to Admin?")) return;
    try {
        await api.put(`/users/${id}/role`, { role: 'admin' });
        toast.success("User promoted to Admin!");
        fetchUsers();
    } catch (error) {
        toast.error("Failed to update role");
    }
  };

  // --- Delete User ---
  const handleDelete = async (id) => {
    if(!confirm("Warning! This will delete the user and all their records. Continue?")) return;
    try {
        await api.delete(`/users/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
    } catch (error) {
        toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" /> Manage Students
        </h1>
        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Search Name, ID, Phone..." 
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
                <tr>
                <th className="p-4">Student Info</th>
                <th className="p-4">ID & Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="font-bold text-gray-500">{user.name.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </td>
                    <td className="p-4">
                        <p className="font-mono font-medium text-primary">{user.studentId || "N/A"}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {user.role}
                        </span>
                    </td>
                    <td className="p-4">
                        {user.isVerified ? (
                            <span className="text-green-600 text-xs font-bold flex items-center gap-1">Verified</span>
                        ) : (
                            <span className="text-yellow-600 text-xs font-bold">Unverified</span>
                        )}
                    </td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                            {user.role !== 'admin' && (
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    title="Make Admin"
                                    onClick={() => handleMakeAdmin(user._id)}
                                >
                                    <Shield className="h-4 w-4 text-purple-600" />
                                </Button>
                            )}
                            <Button 
                                size="sm" 
                                variant="destructive"
                                className="h-8 w-8 p-0 bg-red-100 text-red-600 hover:bg-red-200 border-none"
                                title="Delete User"
                                onClick={() => handleDelete(user._id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </td>
                </tr>
                ))}
                {filteredUsers.length === 0 && (
                    <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400">No students found.</td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}