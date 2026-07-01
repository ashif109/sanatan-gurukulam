import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Course } from '../types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ExploreViewProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  cart: any[];
  onAddToCart: (course: Course) => void;
}

export function ExploreView({ courses, onCourseClick, cart, onAddToCart }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[var(--color-occult-bg)] min-h-screen pb-20 font-sans">
      
      {/* Hero Section */}
      <section className="w-full bg-[var(--color-occult-purple)] text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-[#c4a9ff] font-bold tracking-widest text-sm uppercase mb-4">
            Sacred Academy Curriculum
          </h3>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white drop-shadow-sm">
            Sacred Courses & Deep Dives
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Curated learning paths blending textual accuracy with practical lineage application. Study our rich shastras today.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <Card className="shadow-lg">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <Input 
                leftIcon={<Search className="w-5 h-5" />}
                placeholder="Search Vedas, Upanishads, Jyotish, Sanskrit grammar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-gray-50 focus:bg-white text-base py-3"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select className="flex-1 md:w-48 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-occult-purple)]">
                <option>All Categories</option>
                <option>Astrology & Jyotish</option>
                <option>Numerology</option>
                <option>Vastu Shastra</option>
              </select>
              <select className="flex-1 md:w-48 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-occult-purple)]">
                <option>Any Difficulty</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <Card key={course.id} className="group hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col h-full border-gray-200">
              <div className="relative h-56 w-full overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-4 left-4 bg-[var(--color-occult-purple)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {course.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-[var(--color-occult-purple)] backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                  {course.difficulty}
                </div>
              </div>
              
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center text-gray-500 text-xs mb-6 space-x-4 font-medium">
                  <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {course.duration || '20 Hours'}</div>
                  <div className="flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> 2,00,000+</div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-sm ml-1 text-gray-900">4.8</span>
                    <span className="text-xs text-gray-600 ml-1">(2.1k)</span>
                  </div>
                  <div className="font-bold text-lg text-gray-900">₹{course.price}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button variant="outline" onClick={() => onCourseClick(course)}>
                    View Details
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(course);
                    }}
                    disabled={cart.some(item => item.id === course.id)}
                  >
                    {cart.some(item => item.id === course.id) ? 'Added' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </section>
    </div>
  );
}
