"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Clock, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_at: string | null;
  priority: "low" | "normal" | "high";
  status: "pending" | "done" | "canceled";
}

export function LeadTasks({ leadId, initialTasks }: { leadId: string; initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("normal");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const doneTasks = tasks.filter((task) => task.status === "done");

  async function createTask(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/lead-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId, title, description: description || null, due_at: dueAt || null, priority }),
    });
    if (res.ok) {
      const json = await res.json();
      setTasks((current) => [json.task, ...current]);
      setTitle("");
      setDescription("");
      setDueAt("");
      setPriority("normal");
      router.refresh();
    }
    setSaving(false);
  }

  async function completeTask(taskId: string) {
    const res = await fetch("/api/lead-tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, status: "done" }),
    });
    if (res.ok) {
      setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status: "done" } : task));
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={createTask} className="space-y-2">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nueva tarea" className="border-foreground/10 bg-muted/20 text-sm" />
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Detalle opcional" className="h-16 border-foreground/10 bg-muted/20 text-sm" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Task["priority"])}
            className="h-10 border border-foreground/10 bg-muted/20 px-3 text-sm text-foreground"
          >
            <option value="low">Baja prioridad</option>
            <option value="normal">Prioridad normal</option>
            <option value="high">Alta prioridad</option>
          </select>
        <Input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} className="border-foreground/10 bg-muted/20 text-sm" />
        </div>
        <Button size="sm" disabled={saving || !title.trim()} className="w-full bg-gold-500 text-black hover:bg-gold-600">
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          Crear tarea
        </Button>
      </form>
      <div className="space-y-2">
        {pendingTasks.map((task) => <TaskCard key={task.id} task={task} onComplete={completeTask} />)}
        {doneTasks.map((task) => <TaskCard key={task.id} task={task} onComplete={completeTask} />)}
        {tasks.length === 0 && <p className="py-4 text-center text-sm text-foreground/45">Sin tareas pendientes.</p>}
      </div>
    </div>
  );
}

function TaskCard({ task, onComplete }: { task: Task; onComplete: (taskId: string) => void }) {
  const dueDate = task.due_at ? new Date(task.due_at) : null;
  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const isOverdue = task.status === "pending" && !!dueDate && dueDate < now;
  const isDueToday = task.status === "pending" && !!dueDate && dueDate >= now && dueDate <= endOfToday;
  const priorityClass = task.priority === "high" ? "text-red-400" : task.priority === "low" ? "text-white/40" : "text-gold-500";

  return (
    <div className={`border p-3 ${isOverdue ? "border-red-500/25 bg-red-500/10" : isDueToday ? "border-gold-500/25 bg-gold-500/10" : "border-foreground/10 bg-muted/20"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm font-medium ${task.status === "done" ? "text-foreground/40 line-through" : "text-foreground"}`}>{task.title}</p>
            <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${priorityClass}`}>{task.priority === "high" ? "Alta" : task.priority === "low" ? "Baja" : "Normal"}</span>
          </div>
          {task.description && <p className="mt-1 text-xs leading-5 text-foreground/55">{task.description}</p>}
          {dueDate && (
            <p className={`mt-2 flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : isDueToday ? "text-gold-500" : "text-foreground/45"}`}>
              {isOverdue ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {dueDate.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          )}
        </div>
        {task.status !== "done" && (
          <button onClick={() => onComplete(task.id)} className="text-emerald-400 hover:text-emerald-300" aria-label="Completar tarea">
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
