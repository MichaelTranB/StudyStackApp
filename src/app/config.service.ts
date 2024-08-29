import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';

const supabaseUrl = 'https://bylojwooqeylbizbxlxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bG9qd29vcWV5bGJpemJ4bHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4NzQwMDYsImV4cCI6MjA0MDQ1MDAwNn0.GVPnlxI0FM1BUc6iZ0EM0adZxazVIJtUtKKiBz8RSaI';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getCourses(): Observable<any[]> {
    return from(this.fetchCoursesFromSupabase());
  }

  private async fetchCoursesFromSupabase() {
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
      questions: course.questions || []
    }));
  }
}
