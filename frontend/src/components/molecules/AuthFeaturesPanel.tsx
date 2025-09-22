"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Avatar } from "@heroui/react";
import { authFeatures, authTestimonials, authStats } from "@/data/authFeatures";
import { Star, Users, BookOpen, Award } from "lucide-react";

interface AuthFeaturesPanelProps {
  className?: string;
  isMobile?: boolean;
}

export function AuthFeaturesPanel({ className, isMobile = false }: AuthFeaturesPanelProps) {
  return (
    <div className={`flex flex-col justify-center ${isMobile ? 'space-y-6' : 'space-y-8'} ${className}`}>
      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white ${isMobile ? 'p-6' : 'p-8'}`}
      >
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`font-bold mb-4 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
          >
            Start Your Learning Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`opacity-90 ${isMobile ? 'text-base mb-4' : 'text-lg mb-6'}`}
          >
            Join thousands of learners who have transformed their careers with CLARIO
          </motion.p>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'gap-4'}`}
          >
            {authStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{stat.value}</div>
                <div className={`opacity-80 ${isMobile ? 'text-xs' : 'text-sm'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20" />
          <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-white/15" />
          <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded-full bg-white/10" />
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-4"
      >
        <h3 className={`font-semibold text-gray-900 dark:text-white mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Why Choose CLARIO?
        </h3>
        <div className="space-y-3">
          {authFeatures.slice(0, isMobile ? 3 : 4).map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="text-2xl flex-shrink-0">{feature.icon}</div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonial */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-0">
            <CardBody className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              "{authTestimonials[0].content}"
            </blockquote>
            <div className="flex items-center space-x-3">
              <Avatar
                name={authTestimonials[0].avatar}
                size="sm"
                className="bg-primary-500 text-white"
              />
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {authTestimonials[0].name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {authTestimonials[0].role}
                </div>
              </div>
            </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="flex items-center justify-center space-x-6 text-gray-500 dark:text-gray-400"
      >
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-xs">50K+ Students</span>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4" />
          <span className="text-xs">200+ Courses</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-4 w-4" />
          <span className="text-xs">Industry Certified</span>
        </div>
      </motion.div>
    </div>
  );
}