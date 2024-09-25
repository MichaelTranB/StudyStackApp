import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { Course } from './shared/models/course.model';

const supabaseUrl = 'https://bylojwooqeylbizbxlxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bG9qd29vcWV5bGJpemJ4bHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4NzQwMDYsImV4cCI6MjA0MDQ1MDAwNn0.GVPnlxI0FM1BUc6iZ0EM0adZxazVIJtUtKKiBz8RSaI';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getCourses(): Observable<Course[]> {
    return from(this.fetchCoursesFromSupabase());
  }

  private async fetchCoursesFromSupabase(): Promise<Course[]> {
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        name,
        description,
        questions:questions (
          question,
          answer
        )
      `);

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      components: {
        practice: { questions: course.questions || [] },
        study: { questions: course.questions || [] }
      }
    }));
  }

  async addQuestionToCourse(courseId: number, question: string, answer: string): Promise<void> {
    const { data, error } = await supabase
      .from('questions')
      .insert([{ course_id: courseId, question, answer }]);

    if (error) {
      throw error;
    }

    console.log('Question added:', data);
  }

  async createNewCourse(courseName: string, description: string): Promise<void> {
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert([{ name: courseName, description }])
      .select('id');

    if (courseError) {
      throw courseError;
    }

    console.log('New course added:', courseData);
  }

  // Update streak in Supabase
  async updateStreak(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Check if the user already has a streak record
    let { data: userStreakData, error } = await supabase
      .from('user_streaks')
      .select('last_streak_update, streak')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means the record doesn't exist
      console.error('Error fetching streak:', error);
      return;
    }

    let newStreak = 1; // Default streak for a new record or reset
    if (userStreakData) {
      const lastLoginDate = userStreakData.last_streak_update;

      // If the user already logged in today, do nothing
      if (today === lastLoginDate) {
        console.log('User already logged in today, streak not updated');
        return;
      } else if (new Date(today).getTime() - new Date(lastLoginDate).getTime() === 86400000) {
        newStreak = userStreakData.streak + 1; // Increment streak if consecutive day
      }
    }

    // Upsert (insert or update) streak data
    const { error: upsertError } = await supabase
      .from('user_streaks')
      .upsert({
        user_id: userId,
        streak: newStreak,
        last_streak_update: today
      });

    if (upsertError) {
      console.error('Error updating streak:', upsertError);
    } else {
      console.log('Streak updated successfully');
    }
  }

  // Retrieve the current streak for a user
  async getStreak(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('streak')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching streak:', error);
      return 0;
    }

    return data?.streak || 0;
  }
}