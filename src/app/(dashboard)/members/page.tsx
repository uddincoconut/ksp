"use client";

import { useEffect, useState, useCallback } from "react";
import AddMemberModal from "@/components/AddMemberModal";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  joinDate: string;
  status: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        setMembers(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  function handleSuccess() {
    setShowModal(false);
    fetchMembers();
  }

  return (
    <div>
      {/* Page title + actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-base-content">Members</h1>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setShowModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Member
        </button>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="font-medium">No members yet</p>
              <p className="text-sm">
                Click &ldquo;Add Member&rdquo; to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Join Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, idx) => (
                    <tr key={m.id} className="hover">
                      <td className="text-base-content/40 text-sm">{idx + 1}</td>
                      <td className="font-medium">{m.name}</td>
                      <td className="text-base-content/70">{m.email}</td>
                      <td className="text-base-content/70">{m.phone ?? "—"}</td>
                      <td className="text-base-content/70 max-w-48 truncate">
                        {m.address ?? "—"}
                      </td>
                      <td className="text-base-content/60 text-sm">
                        {new Date(m.joinDate).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            m.status === "active"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer count */}
      {!loading && members.length > 0 && (
        <p className="text-sm text-base-content/50 mt-3">
          Showing {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <AddMemberModal
          onSuccess={handleSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
