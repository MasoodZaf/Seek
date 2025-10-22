import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BrandIcon from '../ui/BrandIcon';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * Professional community features with moderation and engagement tools
 */
const CommunityFeatures = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('discussions');

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: 'chat' },
    { id: 'showcase', label: 'Showcase', icon: 'star' },
    { id: 'help', label: 'Help & Support', icon: 'info' },
    { id: 'events', label: 'Events', icon: 'calendar' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Community Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Join Our Learning Community
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with fellow developers, share your projects, get help, and celebrate achievements together.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">12,500+</div>
          <div className="text-sm text-gray-600">Active Learners</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">8,200+</div>
          <div className="text-sm text-gray-600">Projects Shared</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">15,000+</div>
          <div className="text-sm text-gray-600">Questions Answered</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">500+</div>
          <div className="text-sm text-gray-600">Weekly Events</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <BrandIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'discussions' && <DiscussionsTab />}
        {activeTab === 'showcase' && <ShowcaseTab />}
        {activeTab === 'help' && <HelpTab />}
        {activeTab === 'events' && <EventsTab />}
      </div>
    </div>
  );
};

// Discussions Tab Component
const DiscussionsTab = () => {
  const discussions = [
    {
      id: 1,
      title: "Best practices for React hooks?",
      author: "Sarah Chen",
      replies: 23,
      lastActivity: "2 hours ago",
      tags: ["React", "JavaScript", "Best Practices"],
      isHot: true
    },
    {
      id: 2,
      title: "How to optimize Python code for performance?",
      author: "Mike Johnson",
      replies: 15,
      lastActivity: "4 hours ago",
      tags: ["Python", "Performance", "Optimization"]
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox - When to use what?",
      author: "Emma Wilson",
      replies: 31,
      lastActivity: "6 hours ago",
      tags: ["CSS", "Layout", "Web Design"],
      isPinned: true
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Recent Discussions</h3>
        <Button variant="primary" size="sm">
          Start Discussion
        </Button>
      </div>
      
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {discussion.isPinned && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <BrandIcon name="pin" size={12} className="mr-1" />
                      Pinned
                    </span>
                  )}
                  {discussion.isHot && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <BrandIcon name="fire" size={12} className="mr-1" />
                      Hot
                    </span>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                  {discussion.title}
                </h4>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>by {discussion.author}</span>
                  <span>{discussion.replies} replies</span>
                  <span>{discussion.lastActivity}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {discussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <BrandIcon name="chevron-right" size={20} className="text-gray-400 ml-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Showcase Tab Component
const ShowcaseTab = () => {
  const projects = [
    {
      id: 1,
      title: "Personal Portfolio Website",
      author: "Alex Rodriguez",
      language: "React",
      likes: 45,
      views: 230,
      image: "/api/placeholder/300/200",
      featured: true
    },
    {
      id: 2,
      title: "Weather App with API Integration",
      author: "Lisa Park",
      language: "JavaScript",
      likes: 32,
      views: 180,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Data Visualization Dashboard",
      author: "David Kim",
      language: "Python",
      likes: 67,
      views: 340,
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Community Showcase</h3>
        <Button variant="primary" size="sm">
          Share Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-video bg-gray-200 relative">
              {project.featured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-medium">
                  Featured
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-sm text-gray-600 mb-3">by {project.author}</p>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  {project.language}
                </span>
                
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <BrandIcon name="heart" size={14} />
                    <span>{project.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BrandIcon name="eye" size={14} />
                    <span>{project.views}</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Help Tab Component
const HelpTab = () => {
  const helpTopics = [
    {
      category: "Getting Started",
      questions: [
        "How do I create my first project?",
        "What programming languages are supported?",
        "How do I save and share my code?"
      ]
    },
    {
      category: "Tutorials & Learning",
      questions: [
        "How do I track my learning progress?",
        "Can I skip tutorials if I already know the topic?",
        "How do achievements and badges work?"
      ]
    },
    {
      category: "Technical Support",
      questions: [
        "My code isn't running, what should I do?",
        "How do I report a bug?",
        "Why is the platform running slowly?"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">How can we help you?</h3>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <BrandIcon name="search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helpTopics.map((topic) => (
          <Card key={topic.category} className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">{topic.category}</h4>
            <ul className="space-y-3">
              {topic.questions.map((question, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {question}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
        <div className="space-x-4">
          <Button variant="primary">Contact Support</Button>
          <Button variant="secondary">Join Discord</Button>
        </div>
      </div>
    </div>
  );
};

// Events Tab Component
const EventsTab = () => {
  const events = [
    {
      id: 1,
      title: "Weekly Code Review Session",
      date: "Every Friday, 3:00 PM EST",
      type: "Recurring",
      attendees: 45,
      description: "Join our community for weekly code reviews and feedback sessions."
    },
    {
      id: 2,
      title: "Python Workshop: Web Scraping",
      date: "March 15, 2025, 2:00 PM EST",
      type: "Workshop",
      attendees: 120,
      description: "Learn web scraping techniques using Python and Beautiful Soup."
    },
    {
      id: 3,
      title: "React Hackathon",
      date: "March 20-22, 2025",
      type: "Hackathon",
      attendees: 200,
      description: "48-hour hackathon focused on building React applications."
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
        <Button variant="primary" size="sm">
          Suggest Event
        </Button>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${event.type === 'Recurring' ? 'bg-green-100 text-green-800' :
                      event.type === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'}
                  `}>
                    {event.type}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <BrandIcon name="calendar" size={14} />
                    <span>{event.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BrandIcon name="users" size={14} />
                    <span>{event.attendees} attending</span>
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{event.description}</p>
                
                <div className="flex space-x-3">
                  <Button variant="primary" size="sm">Join Event</Button>
                  <Button variant="secondary" size="sm">Learn More</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

CommunityFeatures.propTypes = {
  className: PropTypes.string,
};

export default CommunityFeatures;