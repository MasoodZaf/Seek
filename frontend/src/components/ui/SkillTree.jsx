import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  CheckCircleIcon,
  LockClosedIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const SkillTree = ({ skills = [], className, onNodeClick, ...props }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className={clsx('relative p-8', className)} {...props}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* Connection lines between nodes */}
        {skills.map((skill, index) => {
          if (!skill.prerequisites || skill.prerequisites.length === 0) return null;
          
          return skill.prerequisites.map((prereqId) => {
            const prereq = skills.find(s => s.id === prereqId);
            if (!prereq) return null;
            
            return (
              <motion.line
                key={`${prereqId}-${skill.id}`}
                x1={`${prereq.position.x}%`}
                y1={`${prereq.position.y}%`}
                x2={`${skill.position.x}%`}
                y2={`${skill.position.y}%`}
                stroke={skill.unlocked ? '#3b82f6' : '#d1d5db'}
                strokeWidth="2"
                strokeDasharray={skill.unlocked ? '0' : '5,5'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            );
          });
        })}
      </svg>

      {/* Skill nodes */}
      <div className="relative" style={{ zIndex: 2 }}>
        {skills.map((skill, index) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            index={index}
            isHovered={hoveredNode === skill.id}
            onHover={setHoveredNode}
            onClick={onNodeClick}
          />
        ))}
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <SkillTooltip
          skill={skills.find(s => s.id === hoveredNode)}
          onClose={() => setHoveredNode(null)}
        />
      )}
    </div>
  );
};

const SkillNode = ({ skill, index, isHovered, onHover, onClick }) => {
  const {
    id,
    title,
    description,
    position,
    unlocked,
    completed,
    progress = 0,
    type = 'skill',
    icon: Icon,
  } = skill;

  const getNodeStyle = () => {
    if (completed) return 'bg-success-500 border-success-600 text-white shadow-success-500/50';
    if (unlocked) return 'bg-primary-500 border-primary-600 text-white shadow-primary-500/50';
    return 'bg-secondary-200 border-secondary-300 text-secondary-500';
  };

  const getNodeSize = () => {
    switch (type) {
      case 'milestone': return 'w-16 h-16';
      case 'bonus': return 'w-10 h-10';
      default: return 'w-12 h-12';
    }
  };

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onHoverStart={() => onHover(id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onClick?.(skill)}
    >
      <div
        className={clsx(
          'relative rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg',
          getNodeStyle(),
          getNodeSize(),
          {
            'shadow-xl': isHovered,
            'cursor-not-allowed opacity-50': !unlocked && !completed,
          }
        )}
      >
        {/* Progress ring for unlocked but not completed skills */}
        {unlocked && !completed && progress > 0 && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </svg>
        )}

        {/* Icon or status indicator */}
        <div className="relative z-10">
          {completed ? (
            <CheckCircleIconSolid className="w-6 h-6" />
          ) : unlocked ? (
            Icon ? <Icon className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />
          ) : (
            <LockClosedIcon className="w-5 h-5" />
          )}
        </div>

        {/* Glow effect for special nodes */}
        {(completed || (unlocked && isHovered)) && (
          <motion.div
            className="absolute inset-0 rounded-full bg-current opacity-20 blur-md"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Node label */}
      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100 whitespace-nowrap">
          {title}
        </div>
        {progress > 0 && !completed && (
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            {progress}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SkillTooltip = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <motion.div
      className="absolute z-50 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 p-4 max-w-xs"
      style={{
        left: `${skill.position.x}%`,
        top: `${skill.position.y}%`,
        transform: 'translate(-50%, -120%)',
      }}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-2">
        <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
          {skill.title}
        </h4>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          {skill.description}
        </p>
        
        {skill.requirements && (
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            <strong>Requirements:</strong> {skill.requirements.join(', ')}
          </div>
        )}
        
        {skill.rewards && (
          <div className="text-xs text-primary-600 dark:text-primary-400">
            <strong>Rewards:</strong> {skill.rewards.join(', ')}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-secondary-200 dark:border-secondary-600">
          <span className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full',
            skill.completed ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' :
            skill.unlocked ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' :
            'bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300'
          )}>
            {skill.completed ? 'Completed' : skill.unlocked ? 'Available' : 'Locked'}
          </span>
          
          {skill.xpReward && (
            <span className="text-xs text-warning-600 dark:text-warning-400">
              +{skill.xpReward} XP
            </span>
          )}
        </div>
      </div>
      
      {/* Arrow pointing to node */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-secondary-800" />
      </div>
    </motion.div>
  );
};

export default SkillTree;