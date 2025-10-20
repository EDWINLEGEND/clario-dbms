"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoUsers = [
  {
    name: "Alex Chen",
    email: "alex.chen@clario-demo.com",
    type: "Visual Learner",
    persona: "College Student",
    engagement: "High",
    streak: 21,
    level: 6,
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
  },
  {
    name: "Maya Rodriguez",
    email: "maya.rodriguez@clario-demo.com",
    type: "Auditory Learner",
    persona: "Early Professional",
    engagement: "Medium",
    streak: 14,
    level: 4,
    color: "from-purple-500/20 to-purple-600/20 border-purple-500/30"
  },
  {
    name: "Jordan Park",
    email: "jordan.park@clario-demo.com",
    type: "Kinesthetic Learner",
    persona: "Independent Developer",
    engagement: "Very High",
    streak: 45,
    level: 8,
    color: "from-green-500/20 to-green-600/20 border-green-500/30"
  },
  {
    name: "Sarah Thompson",
    email: "sarah.thompson@clario-demo.com",
    type: "Visual Learner",
    persona: "Career Switcher",
    engagement: "New User",
    streak: 5,
    level: 2,
    color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30"
  },
  {
    name: "David Kumar",
    email: "david.kumar@clario-demo.com",
    type: "Auditory Learner",
    persona: "Graduate Student",
    engagement: "Medium-High",
    streak: 28,
    level: 5,
    color: "from-pink-500/20 to-pink-600/20 border-pink-500/30"
  }
];

export function DemoUserSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectUser = (email: string) => {
    console.log(`Demo: Switching to user ${email}`);
    // In a real implementation, this would:
    // 1. Call a demo API endpoint to get a token for this user
    // 2. Store the token in localStorage
    // 3. Refresh the page or update the auth context
    // For now, just log it
    alert(`Demo Mode: Would log in as ${email}\n\nTo implement:\n1. Create a demo endpoint that returns JWT for demo users\n2. Store token and refresh UI`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Demo Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 rounded-full"
          size="lg"
        >
          <Users className="w-5 h-5 mr-2" />
          Demo Users
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </motion.div>

      {/* User Selection Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[600px] overflow-auto"
            >
              <Card className="border-white/20 bg-gray-900/95 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Demo Users</h3>
                      <p className="text-sm text-white/60">Click to switch user persona</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* User List */}
                  <div className="space-y-3">
                    {demoUsers.map((user, index) => (
                      <motion.div
                        key={user.email}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <button
                          onClick={() => handleSelectUser(user.email)}
                          className={`w-full text-left p-4 rounded-lg bg-gradient-to-r ${user.color} border hover:scale-[1.02] transition-all duration-200 group`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-white font-semibold truncate">{user.name}</h4>
                                  <p className="text-white/60 text-xs truncate">{user.email}</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                <Badge variant="outline" className="text-xs border-white/30 text-white bg-white/10">
                                  {user.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-white/30 text-white bg-white/10">
                                  {user.persona}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-white/70">
                                <span className="flex items-center gap-1">
                                  🔥 {user.streak}d streak
                                </span>
                                <span className="flex items-center gap-1">
                                  ⭐ Level {user.level}
                                </span>
                                <span className="flex items-center gap-1">
                                  {user.engagement}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Note */}
                  <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/60 text-center">
                      💡 <strong>Demo Mode:</strong> Each user has different learning styles, projects, and progress to showcase various features
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

