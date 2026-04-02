import { supabase } from "@/lib/supabase/client";
import { authService } from "@/lib/supabase/account";
import type {
  QuestionDataPayload,
  SavedQuestion,
  SearchHistory,
} from "@/lib/supabase/types";

export const savedQuestionsService = {
  async getSavedQuestions(): Promise<SavedQuestion[]> {
    const { data, error } = await supabase
      .from("saved_questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved questions:", error);
      throw error;
    }

    return data ?? [];
  },

  async saveQuestion(questionData: QuestionDataPayload, note?: string): Promise<SavedQuestion> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("saved_questions")
      .upsert(
        {
          user_id: user.id,
          question_id: questionData.id,
          question_data: questionData,
          note,
        },
        {
          onConflict: "user_id,question_id",
        },
      )
      .select("*")
      .single();

    if (error) {
      console.error("Error saving question:", error);
      throw error;
    }

    return data;
  },

  async unsaveQuestion(questionId: string): Promise<void> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("saved_questions")
      .delete()
      .eq("user_id", user.id)
      .eq("question_id", questionId);

    if (error) {
      console.error("Error unsaving question:", error);
      throw error;
    }
  },

  async updateNote(questionId: string, note: string): Promise<SavedQuestion> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("saved_questions")
      .update({ note })
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating note:", error);
      throw error;
    }

    return data;
  },

  async isQuestionSaved(questionId: string): Promise<boolean> {
    const user = await authService.getCurrentUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from("saved_questions")
      .select("id")
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .maybeSingle();

    return !error && Boolean(data);
  },
};

export const searchHistoryService = {
  async getSearchHistory(): Promise<SearchHistory[]> {
    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching search history:", error);
      throw error;
    }

    return data ?? [];
  },

  async addSearch(searchTerm: string, resultCount: number): Promise<SearchHistory> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("search_history")
      .insert({
        user_id: user.id,
        search_term: searchTerm,
        result_count: resultCount,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error adding search history:", error);
      throw error;
    }

    return data;
  },

  async clearSearchHistory(): Promise<void> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing search history:", error);
      throw error;
    }
  },
};
