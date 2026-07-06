"use client";

import { useState, useCallback } from "react";

interface MemberRow {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const emptyRow = (): MemberRow => ({
  name: "",
  email: "",
  phone: "",
  address: "",
});

interface AddMemberModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AddMemberModal({
  onSuccess,
  onClose,
}: AddMemberModalProps) {
  const [rows, setRows] = useState<MemberRow[]>([emptyRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateRow = useCallback(
    (index: number, field: keyof MemberRow, value: string) => {
      setRows((prev) =>
        prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
      );
    },
    []
  );

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const valid = rows.every((r) => r.name.trim() && r.email.trim());
    if (!valid) {
      setError("Name and email are required for every member.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to add members");
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-full max-w-3xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-1">Add Members</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Fill in the details below. You can add multiple members at once.
        </p>

        {error && (
          <div className="alert alert-error text-sm py-2 mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr>
                  <th className="w-6">#</th>
                  <th>
                    Name <span className="text-error">*</span>
                  </th>
                  <th>
                    Email <span className="text-error">*</span>
                  </th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td className="text-base-content/40 text-xs">{i + 1}</td>
                    <td>
                      <input
                        className="input input-sm w-full"
                        placeholder="Full name"
                        value={row.name}
                        onChange={(e) => updateRow(i, "name", e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        className="input input-sm w-full"
                        placeholder="email@example.com"
                        value={row.email}
                        onChange={(e) => updateRow(i, "email", e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="input input-sm w-full"
                        placeholder="+62..."
                        value={row.phone}
                        onChange={(e) => updateRow(i, "phone", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input input-sm w-full"
                        placeholder="Address"
                        value={row.address}
                        onChange={(e) =>
                          updateRow(i, "address", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeRow(i)}
                        disabled={rows.length === 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm mt-3 gap-2"
            onClick={addRow}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
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
            Add another row
          </button>

          <div className="modal-action mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                `Add ${rows.length} Member${rows.length > 1 ? "s" : ""}`
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
