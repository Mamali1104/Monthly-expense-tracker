import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../services/api";

const AddTransaction = ({ onAdd, editingTx, clearEdit }) => {
    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState("");

    /* ================= PREFILL FORM ON EDIT ================= */
    useEffect(() => {
        if (editingTx) {
            setType(editingTx.type);
            setAmount(editingTx.amount);
            setCategory(editingTx.category);
            setNote(editingTx.note || "");
            setDate(editingTx.date.slice(0, 10));
        }
    }, [editingTx]);

    /* ================= SUBMIT HANDLER ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await apiFetch(
                editingTx
                    ? `/transactions/${editingTx._id}`
                    : "/transactions",
                {
                    method: editingTx ? "PUT" : "POST",
                    body: JSON.stringify({
                        type,
                        amount: Number(amount),
                        category,
                        note,
                        date,
                    }),
                }
            );

            toast.success(
                editingTx
                    ? "Transaction updated successfully"
                    : "Transaction added successfully"
            );

            // Reset form
            setType("expense");
            setAmount("");
            setCategory("");
            setNote("");
            setDate("");

            if (editingTx) clearEdit();
            onAdd();

        } catch (err) {
            toast.error("Failed to save transaction");
            console.error("Transaction error:", err);
        }
    };

    const inputClass = `
      w-full bg-slate-900 text-gray-200
      border border-slate-700
      p-2 rounded-lg
      placeholder-gray-500
      focus:outline-none
      focus:ring-2 focus:ring-teal-400
    `;

    return (
        <div
            className="
              bg-slate-800 border border-slate-700 rounded-xl p-6
              shadow-lg hover:shadow-[0_0_25px_rgba(45,212,191,0.15)]
              transition
            "
        >
            <h2
                className={`text-lg font-bold mb-4 ${editingTx ? "text-teal-400" : "text-gray-200"
                    }`}
            >
                {editingTx ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type */}
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={inputClass}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                {/* Amount */}
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputClass}
                    required
                />

                {/* Category */}
                <input
                    type="text"
                    placeholder="Category (Food, Salary, etc)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                    required
                />

                {/* Note */}
                <input
                    type="text"
                    placeholder="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={inputClass}
                />

                {/* Date */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="
    w-full bg-slate-900 text-gray-200
    border border-slate-700
    p-2 rounded-lg
    placeholder-gray-500 
    focus:outline-none
    focus:ring-2 focus:ring-teal-400
    dark:[color-scheme:dark]
  "
                    required
                />

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="
                          flex-1 bg-teal-400 text-slate-900 font-semibold
                          py-2 rounded-lg
                          shadow-[0_0_15px_rgba(45,212,191,0.6)]
                          hover:shadow-[0_0_30px_rgba(45,212,191,0.9)]
                          transition
                        "
                    >
                        {editingTx ? "Update Transaction" : "Add Transaction"}
                    </button>

                    {editingTx && (
                        <button
                            type="button"
                            onClick={() => {
                                toast("Edit cancelled", { icon: "⚠️" });
                                clearEdit();
                                setType("expense");
                                setAmount("");
                                setCategory("");
                                setNote("");
                                setDate("");
                            }}
                            className="
                              flex-1 border border-slate-600 text-gray-300
                              py-2 rounded-lg hover:bg-slate-700 transition
                            "
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddTransaction;
