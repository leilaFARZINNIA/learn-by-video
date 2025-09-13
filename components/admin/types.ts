// app/admin/types.ts
export type Status = "new" | "open" | "done";

export type Item = {
  id: string;
  name: string;
  email: string;
  title: string;
  status: Status;
  createdAtMs: number;
};

export type Counts = { new: number; open: number; done: number };
