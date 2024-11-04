export interface Course {
  id: number;
  name: string;
  description: string;
  topics?: Topic[];  
  components: {
    practice: any;
    study: any;
  };
}

export interface Topic {
  title: string;
}