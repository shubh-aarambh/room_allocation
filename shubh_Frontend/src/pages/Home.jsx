import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import ResourceCard from '../components/ResourceCard';
import BookingModal from '../components/BookingModal';
import { FiSearch, FiInbox, FiArrowRight, FiStar, FiUsers, FiCalendar, FiMapPin, FiMail, FiPhone, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function Home() {
  const [resources, setResources] = useState([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/resources');
      const data = res?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.resources)
        ? data.resources
        : data?.items && Array.isArray(data.items)
        ? data.items
        : []; // fallback empty array
      setResources(list);
    } catch (err) {
      setError('Failed to load resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const filtered = (Array.isArray(resources) ? resources : []).filter((r) =>
    (r.name || '').toLowerCase().includes(q.toLowerCase()) ||
    (r.type || '').toLowerCase().includes(q.toLowerCase()) ||
    (r.location || '').toLowerCase().includes(q.toLowerCase())
  );

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Enhanced Hero Section */}
      <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900">
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Enhanced particles */}
          <div className="particles">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="particle animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${12 + Math.random() * 8}s`,
                  background: `hsl(${Math.random() * 40 + 250}, 80%, 75%)`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  opacity: `${0.2 + Math.random() * 0.5}`,
                  borderRadius: '50%',
                  boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(139, 92, 246, 0.3)`,
                }}
              ></div>
            ))}
          </div>


        </div>

        {/* Enhanced Hero Content */}
        <div className="relative z-10 text-center px-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-8xl md:text-10xl font-black leading-none tracking-tight mb-4">
              <span className="block bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
                Reserve
              </span>
              <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl animation-delay-200">
                Space
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mx-auto mb-6 animate-pulse-glow"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-white/95 mb-8 animate-slide-up animation-delay-300 leading-tight">
            Smart Resource Management
          </h2>

          <p className="text-2xl md:text-3xl text-white/85 mb-16 max-w-5xl mx-auto leading-relaxed font-medium animate-slide-up animation-delay-500">
            Experience seamless booking with our cutting-edge platform.
            Reserve classrooms, labs, and facilities with just a few clicks.
            <span className="block mt-4 text-xl text-white/70 font-normal">
              Join thousands of students and faculty already using Reserve Space
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 animate-slide-up animation-delay-700">
            <button
              onClick={() => scrollToSection('resources-section')}
              className="group btn-hero-primary text-xl px-12 py-6 shadow-3xl hover:shadow-violet-500/50 hover-glow"
            >
              <span className="flex items-center space-x-4">
                <span>Explore Resources</span>
                <FiArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-all duration-300" />
              </span>
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="btn-hero-secondary text-xl px-12 py-6 shadow-3xl hover:shadow-2xl"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-16 border-2 border-white/50 rounded-full flex justify-center shadow-xl backdrop-blur-md bg-white/15 hover:bg-white/25 transition-all duration-300">
            <div className="w-2 h-5 bg-white/90 rounded-full mt-4 animate-pulse shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Resources Section */}
      <section id="resources-section" className="resources-bg py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-6xl md:text-7xl font-black hero-text-gradient mb-8 animate-slide-up">Available Resources</h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto animate-slide-up animation-delay-200 leading-relaxed font-medium">
              Discover and book the perfect resources for your academic journey.
              From classrooms to labs, find everything you need in one place.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-16 animate-slide-up animation-delay-400">
            <div className="relative group">
              <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-7 h-7 transition-all duration-300 group-focus-within:text-violet-500 group-focus-within:scale-110" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search resources by name, type, or location..."
                className="input-modern-hero pl-20 text-xl py-6 focus-ring"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="glass rounded-3xl p-8 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="inline-flex p-6 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <FiInbox className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Oops! Something went wrong</h3>
              <p className="text-red-600 dark:text-red-400 font-semibold mb-6">{error}</p>
              <button onClick={fetch} className="btn-primary">
                Try Again
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                <FiInbox className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">No resources found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">Try adjusting your search terms or browse all resources</p>
              <button onClick={() => setQ('')} className="btn-primary">
                Show All Resources
              </button>
            </div>
          )}

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((r, idx) => (
              <div
                key={r._id || r.id}
                style={{ animationDelay: `${idx * 100}ms` }}
                className="animate-slide-up hover:scale-105 transition-transform duration-300"
              >
                <ResourceCard resource={r} onBook={(res) => setSelected(res)} />
              </div>
            ))}

            {/* Add more available booking resources */}
            {filtered.length === 0 && !loading && !error && (
              <div className="col-span-full text-center py-20">
                <div className="inline-flex p-8 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full mb-6">
                  <FiCalendar className="w-20 h-20 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">No resources found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">Try adjusting your search terms or browse all resources</p>
                <button onClick={() => setQ('')} className="btn-primary">
                  Show All Resources
                </button>
              </div>
            )}

            {/* Sample resources when no data is available */}
            {filtered.length === 0 && !loading && !error && q === '' && (
              <div className="col-span-full">
                <div className="text-center mb-16 animate-slide-up">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 rounded-full px-6 py-3 mb-8">
                    <FiCalendar className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    <span className="text-violet-700 dark:text-violet-300 font-semibold">Available Now</span>
                  </div>
                  <h3 className="text-4xl font-bold hero-text-gradient mb-6">Available Resources</h3>
                  <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed font-medium">
                    Discover and book from our collection of premium resources. From modern conference rooms to specialized studios, find everything you need for your academic and creative projects.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[
                    {
                      _id: 'sample-1',
                      name: 'Conference Room A',
                      type: 'Room',
                      location: 'Building A, Floor 2',
                      description: 'Modern conference room with video conferencing equipment, seating for 12 people. Perfect for meetings and presentations.'
                    },
                    {
                      _id: 'sample-2',
                      name: 'Study Hall B',
                      type: 'Study Area',
                      location: 'Library Wing, Floor 1',
                      description: 'Quiet study area with individual desks, power outlets, and natural lighting. Ideal for focused work.'
                    },
                    {
                      _id: 'sample-3',
                      name: 'Computer Lab 1',
                      type: 'Lab',
                      location: 'Tech Building, Floor 3',
                      description: 'Fully equipped computer lab with 25 workstations, high-speed internet, and latest software tools.'
                    },
                    {
                      _id: 'sample-4',
                      name: 'Auditorium',
                      type: 'Hall',
                      location: 'Main Building, Ground Floor',
                      description: 'Large auditorium with stage, sound system, and seating for 200 people. Great for lectures and events.'
                    },
                    {
                      _id: 'sample-5',
                      name: 'Project Room C',
                      type: 'Room',
                      location: 'Innovation Center, Floor 4',
                      description: 'Collaborative workspace with whiteboards, projectors, and flexible seating. Designed for group projects.'
                    },
                    {
                      _id: 'sample-6',
                      name: 'Recording Studio',
                      type: 'Studio',
                      location: 'Media Building, Floor 2',
                      description: 'Professional recording studio with audio equipment, soundproofing, and mixing capabilities.'
                    },
                    {
                      _id: 'sample-7',
                      name: 'Gym Equipment',
                      type: 'Equipment',
                      location: 'Sports Complex, Ground Floor',
                      description: 'Access to various gym equipment including treadmills, weights, and exercise machines.'
                    },
                    {
                      _id: 'sample-8',
                      name: 'Photography Studio',
                      type: 'Studio',
                      location: 'Arts Building, Floor 3',
                      description: 'Professional photography studio with lighting equipment, backdrops, and props for creative projects.'
                    }
                  ].map((sampleResource, idx) => (
                    <div
                      key={sampleResource._id}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      className="animate-slide-up hover:scale-105 transition-transform duration-300"
                    >
                      <ResourceCard resource={sampleResource} onBook={(res) => setSelected(res)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced About Us Section */}
      <section id="about-section" className="about-bg py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-6xl md:text-7xl font-black hero-text-gradient mb-8 animate-slide-up">About Reserve Space</h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto animate-slide-up animation-delay-200 leading-relaxed font-medium">
              Revolutionizing resource management for educational institutions worldwide
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="feature-card group">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
                <FiCalendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Smart Booking</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Intelligent booking system that prevents conflicts and optimizes resource utilization across your campus with real-time availability.
              </p>
            </div>

            <div className="feature-card group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Real-time Management</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Live availability tracking and instant notifications to keep everyone informed and organized with seamless coordination.
              </p>
            </div>

            <div className="feature-card group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                <FiMapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">User-Friendly Interface</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Intuitive design that makes booking resources as simple as a few clicks, accessible to all users with modern UX principles.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12">Meet the Developer</h3>
            <div className="max-w-md mx-auto">
              <div className="team-card group">
                <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30 animate-pulse-glow">
                  <span className="text-3xl font-bold text-white">S</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Shubh Shukla</h4>
                <p className="text-violet-600 dark:text-violet-400 font-medium mb-4">Full Stack Developer</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  Passionate about creating innovative solutions for educational technology and resource management systems.
                  Building modern, scalable applications with cutting-edge technologies.
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="mailto:shubhshukla1006@gmail.com" className="social-link">
                    <FiMail className="w-5 h-5" />
                  </a>
                  <a href="tel:+919301386069" className="social-link">
                    <FiPhone className="w-5 h-5" />
                  </a>
                  <a href="#" className="social-link">
                    <FiGithub className="w-5 h-5" />
                  </a>
                  <a href="#" className="social-link">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">Get in Touch</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
              Have questions or need support? We'd love to hear from you!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="contact-item group">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
                  <FiMail className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Email</h4>
                <a href="mailto:shubhshukla1006@gmail.com" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                  shubhshukla1006@gmail.com
                </a>
              </div>

              <div className="contact-item group">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                  <FiPhone className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Phone</h4>
                <a href="tel:+919301386069" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  +91 9301386069
                </a>
              </div>

              <div className="contact-item group">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                  <FiMapPin className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Location</h4>
                <p className="text-indigo-600 dark:text-indigo-400">
                  India
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                © 2024 Reserve Space. Built with ❤️ for educational excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <BookingModal
          resource={selected}
          onClose={() => setSelected(null)}
          onBooked={() => fetch()}
        />
      )}
    </div>
  );
}
