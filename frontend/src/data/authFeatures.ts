export interface AuthFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const authFeatures: AuthFeature[] = [
  {
    id: "personalized-learning",
    title: "Personalized Learning Paths",
    description: "AI-powered recommendations tailored to your skill level and learning goals.",
    icon: "🎯"
  },
  {
    id: "expert-instructors",
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience.",
    icon: "👨‍🏫"
  },
  {
    id: "hands-on-projects",
    title: "Hands-on Projects",
    description: "Build real-world projects that showcase your skills to potential employers.",
    icon: "🛠️"
  },
  {
    id: "community-support",
    title: "Community Support",
    description: "Connect with thousands of learners and get help when you need it.",
    icon: "🤝"
  },
  {
    id: "certificates",
    title: "Industry Certificates",
    description: "Earn recognized certificates that boost your career prospects.",
    icon: "🏆"
  },
  {
    id: "flexible-schedule",
    title: "Learn at Your Pace",
    description: "Study anytime, anywhere with our flexible online learning platform.",
    icon: "⏰"
  }
];

export const authTestimonials = [
  {
    id: "testimonial-1",
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "CLARIO helped me transition from marketing to tech. The hands-on projects were game-changers!",
    avatar: "SC"
  },
  {
    id: "testimonial-2",
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    content: "The personalized learning paths kept me motivated throughout my journey. Highly recommend!",
    avatar: "MJ"
  },
  {
    id: "testimonial-3",
    name: "Elena Rodriguez",
    role: "Data Scientist",
    content: "Amazing community and expert instructors. I landed my dream job within 6 months!",
    avatar: "ER"
  }
];

export const authStats = [
  {
    id: "students",
    value: "50K+",
    label: "Active Students"
  },
  {
    id: "courses",
    value: "200+",
    label: "Expert Courses"
  },
  {
    id: "success-rate",
    value: "95%",
    label: "Success Rate"
  },
  {
    id: "job-placement",
    value: "85%",
    label: "Job Placement"
  }
];