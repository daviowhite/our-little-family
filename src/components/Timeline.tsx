/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Plane, Users, FileText, Church, Sun, Baby, Gift, Star, Home } from 'lucide-react';
import { FamilyStory } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart size={16} />,
  Plane: <Plane size={16} />,
  Users: <Users size={16} />,
  FileText: <FileText size={16} />,
  Church: <Church size={16} />,
  Sun: <Sun size={16} />,
  Baby: <Baby size={16} />,
  Gift: <Gift size={16} />,
  Star: <Star size={16} />,
  Home: <Home size={16} />,
};

interface TimelineProps {
  events: FamilyStory[];
}

export default function Timeline({ events }: TimelineProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
      {sortedEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          {/* Icon Circle */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-gray-600">
            {event.icon && iconMap[event.icon] ? iconMap[event.icon] : <Heart size={16} />}
          </div>

          {/* Content Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <time className="font-mono text-xs font-bold text-blue-500 uppercase">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
            <div className="text-gray-900 font-bold">{event.title}</div>
            {event.description && <div className="text-gray-500 text-sm mt-1">{event.description}</div>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
