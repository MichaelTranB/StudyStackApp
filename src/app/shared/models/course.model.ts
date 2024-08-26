export interface Course {
    id: string;
    name: string;
    description: string;
    components: {
      practice: any;  // Consider using specific types if possible
      study: any;
    };
  }
  