import { supabase } from "@/lib/supabase";
import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Generic CRUD factory backed by Supabase
function createSupabaseService(tableName, idKey) {
  return {
    getAll: async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        throw error;
      }
      return data;
    },

    getById: async (id) => {
      const { data, error } = await supabase.from(tableName).select('*').eq(idKey, id).single();
      if (error) {
        console.error(`Error fetching ${tableName} by id:`, error);
        throw error;
      }
      return data;
    },

    create: async (item) => {
      // Auto-increment logic: fetch max ID and add 1 if not provided
      if (!item[idKey]) {
        const { data: maxData, error } = await supabase
          .from(tableName)
          .select(idKey)
          .order(idKey, { ascending: false })
          .limit(1);

        let nextId = 1;
        if (!error && maxData && maxData.length > 0) {
          nextId = parseInt(maxData[0][idKey] || 0, 10) + 1;
        }
        item[idKey] = nextId;
      }
      const { data, error } = await supabase.from(tableName).insert(item).select().single();
      if (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
      }
      return data;
    },

    update: async (id, updated) => {
      const { data, error } = await supabase.from(tableName).update(updated).eq(idKey, id).select().single();
      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        throw error;
      }
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase.from(tableName).delete().eq(idKey, id);
      if (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
      }
    },
  };
}

// Services
export const departmentService = createSupabaseService("departments", "did");
export const studentService = createSupabaseService("students", "id");
export const startupService = createSupabaseService("startups", "sid");
export const teamService = createSupabaseService("teams", "tid");
export const instructorService = createSupabaseService("instructors", "iid");
export const fundService = createSupabaseService("funds", "fid");
export const exhibitionService = createSupabaseService("exhibitions", "eid");
export const evaluationService = createSupabaseService("evaluations", "eid");

// Relationship data
export const getStartteams = async () => {
  const { data, error } = await supabase.from("startteams").select('*');
  if (error) throw error;
  return data;
};

export const getTinstrs = async () => {
  const { data, error } = await supabase.from("tinstrs").select('*');
  if (error) throw error;
  return data;
};

export const getTeamExhibitions = async () => {
  const { data, error } = await supabase.from("team_exhibitions").select('*');
  if (error) throw error;
  return data;
};

export { api };