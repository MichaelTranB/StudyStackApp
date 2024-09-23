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

    if (!courses || courses.length === 0) {
      console.error('No courses found.');
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

  // Add a new question and answer to a specific course
  async addQuestionToCourse(courseId: number, question: string, answer: string): Promise<void> {
    const { data, error } = await supabase
      .from('questions')
      .insert([{ course_id: courseId, question, answer }]);

    if (error) {
      throw error;
    }

    console.log('Question added:', data);
  }

  // Add a method to create a new course with the first question and answer
  async createNewCourse(courseName: string, description: string): Promise<void> {
    // Insert a new course with name and description
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert([{ name: courseName, description }])
      .select('id');  // Get the course ID of the newly created course
  
    if (courseError) {
      throw courseError;
    }
  
    console.log('New course added:', courseData);
  }
}