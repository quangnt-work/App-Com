// src/actions/StudentActions.ts
"use server";
import { StudentRepository } from "@/repositories/StudentRepository";
import { StudentWithStats } from "@/types/admin";

interface GetStudentsResult {
  data: StudentWithStats[];
  count: number;
  error: string | null;
}

export async function getStudents(
  page: number = 1,
  pageSize: number = 12,
  search: string = ""
): Promise<GetStudentsResult> {
  try {
    return await StudentRepository.getStudentsWithStats({ page, pageSize, search });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: [], count: 0, error: message };
  }
}
